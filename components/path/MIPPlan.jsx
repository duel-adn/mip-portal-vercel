/**
    (C) Duel srl 2021.

    Componenti per la presentazione del risultato del calcolo del percorso

    Revision history

    | Data       | Autore | Descrizione 
    | ---------- | ------ | ----------------------------------- |
    | 2021/11/03 | Duel   | Prima versione                      |
*/

import styles from "./MIPPlan.module.scss"
import { useContext } from "react"
import { Disclosure } from "@headlessui/react"
import useTranslation from 'next-translate/useTranslation'

import { mipConcatenate } from "../../lib/MIPUtility"
import { I18NNamespace, translateDistance, translateDuration, translateUnixDateTime, translateUnixTime } from "../../lib/MIPI18N"

import MIPPath from "./MIPPath"
import { MIPErrorCode } from "../../lib/MIPErrorHandling"
import { MIPPlanMode } from "../../lib/MIPPlannerAPI"

/**
 * Pannelllo con i risultati di una pianificazione
 * 
 * @param {Object} plan piano calcolato dal server 
 * @param {Boolean} displayHeader true se bisogna mostrare i dati riassuntivi del piano
 * @returns il componente React con i risultati del piano
 */
function MIPPlanPanel({ displayHeader }) {
    const {
        plan
    } = useContext(MIPPath.Context)
    console.log('plan')
    console.log(plan)
    return (
        <div className={styles.plan_panel}>
            {plan?.error &&
                <MIPPlanMessages plan={plan} />
            }
            {displayHeader && plan &&
                <MIPPlanDescriptionPanel plan={plan?.plan} />
            }
            {plan &&
                <MIPItinerariesPanel plan={plan?.plan} />
            }
        </div>
    )
}

/**
 * Pannelllo con i messaggi (solo errori) provenienti dal planner
 * 
 * @param {Object} plan piano calcolato dal server 
 * @returns un elemento React con i messaggi di errore
 */
function MIPPlanMessages({ plan }) {
    const { t } = useTranslation(I18NNamespace.ERROR)
    return (
        <>
            {plan?.error &&
                <div className={styles.plan_msg_panel}>
                    {t(plan.error.mipErrorCode ?? MIPErrorCode.MIP_INV_SRV_RESP)}
                </div>
            }
        </>
    )
}

/**
 * Componente che visualizza la descrizione del piano
 * 
 * @param {Object} plan piano generato dal PlanTranslator
 * 
 * @returns il componente React con òa descrizione del piano
 */
function MIPPlanDescriptionPanel({ plan }) {
    const { t, lang } = useTranslation(I18NNamespace.PLANNER)
    return (
        <div className={styles.plan_header}>
            <img src="/path-icons/plan-close.svg" alt="chiudi" />
            <div>
                <div>{t("From")} <b>{plan?.startLocation?.name ?? t("UnnamedLocation")}</b></div>
                <div>{t("To")} <b>{plan?.endLocation?.name ?? t("UnnamedLocation")}</b></div>
                <div>{t("StartTime")} <b>{translateUnixDateTime(lang, plan?.startTime ?? Date.now())}</b></div>
            </div>
        </div>
    )
}

/**
 * Pannello che mostra i dettagli degli itinerari.
 * Se c'è un solo itinerario lo mostra, altrimenti mostra
 * dei disclosure panel che permettono di visualizzare i dettagli 
 * di ciascuno.
 * 
 * @param {Object} plan piano da mostrare
 * @returns un elemento React con i dati degli itinerari
 */
function MIPItinerariesPanel({ plan }) {
    const { t, lang } = useTranslation(I18NNamespace.PLANNER)
    const itineraries = plan?.itineraries
    if (itineraries) {
        return (
            <>
                {/* {(itineraries?.length == 1) &&
                    <>
                        <MIPPlanDescriptionPanel plan={plan} />
                        <MIPItineraryDescriptionPanel itinerary={itineraries[0].description} />
                        <MIPItineraryDetailsPanel className={mipConcatenate(styles.itinerary_panel, styles.open)}
                            open={true} itinerary={itineraries[0]} />
                    </>
                } */}
                {(itineraries?.length > 0) && itineraries.map((itn, idx) =>
                    <Disclosure key={itn?.id ?? idx}>
                        {({ open }) =>
                            <>
                                <Disclosure.Button className={styles.itinerary_expand_button}>
                                    <MIPItineraryDescriptionPanel itinerary={itn} />
                                </Disclosure.Button>
                                <Disclosure.Panel id={itn.id} className={mipConcatenate(styles.itinerary_panel, open ? styles.open : null)}>
                                    <Disclosure.Button className={styles.itinerary_expand_button}>
                                        <MIPPlanDescriptionPanel plan={plan} />
                                    </Disclosure.Button>
                                    <MIPItineraryDescriptionPanel open={open} itinerary={itn} />
                                    <MIPLocationPanel location={plan?.startLocation?.name} />
                                    <MIPItineraryDetailsPanel itinerary={itn} />
                                    <MIPLocationPanel location={plan?.endLocation?.name} />
                                </Disclosure.Panel>
                            </>
                        }
                    </Disclosure>
                )}
            </>
        )
    }
    return null
}

/**
 * Pannello usato per mostrare i dati riassuntivi di un itinerario
 * 
 * @param {Boolean} open flag che dice se il pannello è aperto
 * @param {Object} itinerary itinerario da mostrare
 * @returns 
 */
function MIPItineraryDescriptionPanel({ itinerary, open }) {
    const { t, lang } = useTranslation(I18NNamespace.PLANNER)
    const iconUrl = `/path-icons/${itinerary.mode?.toLowerCase()}.svg`
    return (
        <div className={styles.itinerary_header}>
            <img className={styles.path_icon} src={iconUrl} alt={t(`ModeLabel.${itinerary.mode}`)} />
            <div>
                {itinerary.startTime &&
                    <div className={styles.title}>{t("DepartureTime", { time: translateUnixDateTime(lang, itinerary.startTime) })}</div>
                }
                {itinerary.endTime &&
                    <div className={styles.title}>{t("ArrivalTime", { time: translateUnixTime(lang, itinerary.endTime) })}</div>
                }
                <MIPItineraryPictogram pictogram={itinerary.pictogram} />
                {itinerary.walkDistance_m > 0 &&
                    <p className={styles.title}>
                        {t("ItineraryWalkData", {
                            distance: translateDistance(lang, itinerary.walkDistance_m),
                            time: translateDuration(lang, itinerary.walkTime_s)
                        })}
                    </p>
                }
            </div>
            <div className={styles.details}>
                <div className={styles.duration}>{translateDuration(lang, itinerary.duration_s)}</div>
                <div className={styles.distance}>{translateDistance(lang, itinerary.distance_m)}</div>
            </div>
            {!open &&
                <div className={styles.cta}>{t("Details")}</div>
            }
        </div>
    )
}

function MIPItineraryPictogram({ pictogram }) {
    const { t } = useTranslation(I18NNamespace.PLANNER)

    return (
        pictogram ?
        <div className={styles.pictogram}>
            {pictogram && pictogram.map((pict, idx) =>
                <div key={idx} className={styles.pictogram}>
                    <img src={`/path-icons/${t("LegMode." + pict.mode + ".Icon")}.svg`} alt={t("LegMode." + pict.mode + ".Description")} />
                    {pict.name &&
                        <div className={styles.plate} style={{
                            color: pict.textColor,
                            backgroundColor: pict.color,
                            borderColor: pict.borderColor
                        }}>{pict.name}
                        </div>
                    }
                    {idx != pictogram.length - 1 &&
                        <div className={styles.separator}>&gt;</div>
                    }
                </div>
            )}
        </div>
        : null
    )
}
function MIPItineraryDetailsPanel({ className, itinerary }) {
    return (
        <div className={className}>
            {itinerary.legs?.length == 1 &&
                <MIPLegPanel fixed leg={itinerary.legs[0]} />
            }
            {itinerary.legs?.length > 1 && itinerary.legs.map((leg, idx) =>
                <MIPLegPanel key={leg?.id ?? idx} leg={leg} />
            )}
        </div>
    )
}


/**
 * Pannello usato per mostrare i dati di una Leg
 * 
 * @param {String} locale locale per la traduzione
 * @param {Object} leg itinerario da mostrare
 * @returns 
 */
function MIPLegPanel({ fixed, leg }) {
    if (fixed) {
        return (
            <div className={styles.leg_panel}>
                <MIPLegDescriptionPanel leg={leg} fixed={fixed} />
                {leg.steps && leg.steps.map((step, idx) =>
                    <MIPStepPanel key={step.id ?? idx} step={step} />
                )}
                { }
            </div>
        )
    }
    return (
        <Disclosure as="div" >
            {({ open }) =>
                <>
                    <Disclosure.Button className={styles.leg_expand_button}>
                        <MIPLegDescriptionPanel leg={leg} open={open} />
                    </Disclosure.Button>
                    <Disclosure.Panel>
                        {leg.steps && leg.steps.map((step, idx) =>
                            <MIPStepPanel key={step.id ?? idx} step={step} />
                        )}
                        {leg.intermediateStops && leg.intermediateStops.map((stop, idx) =>
                            <MIPStopPanel key={stop.id ?? idx} leg={leg} stop={stop} />
                        )}
                    </Disclosure.Panel>
                </>
            }
        </Disclosure>
    )
}

function MIPLegDescription({ leg }) {
    const { t, lang } = useTranslation(I18NNamespace.PLANNER)
    if (leg.isTransit) {
        return (
            <div>
                <div className={styles.title}>
                    <div className={styles.plate} style={{
                        color: leg.routeTextColor || "#222",
                        backgroundColor: leg.routeColor || "white",
                        borderColor: leg.routeColor || "gray"
                    }}>{leg.transitRouteName}
                    </div>
                    {route.agencyUrl ?
                        <div><a href={route.agencyUrl} target="_blank" rel="noopener noreferrer">
                            {leg.agencyName}
                        </a></div>
                        :
                        <div>{leg.agencyName}</div>
                    }
                </div>
                <div className={styles.title}>
                    {leg.headsign}
                </div>
                <div className={styles.title}>
                    da {leg.startLocation?.name}
                </div>
                <div className={styles.title}>
                    a {leg.endLocation?.name}
                </div>
            </div>
        )
    }
    return (<div>
        <div>fino a {leg?.endLocation?.name}</div>
        <div>{translateDuration(lang, leg?.duration_s)}</div>
        <div>{translateDistance(lang, leg?.distance_m)}</div>
    </div>
    )
}

function MIPLegDescriptionPanel({ leg, fixed, open }) {
    const { t, lang } = useTranslation(I18NNamespace.PLANNER)
    const iconUrl = "/path-icons/" + t(`LegMode.${leg.mode}.Icon`) + ".svg"
    const description = t(`LegMode.${leg.mode}.Description`)
    const startName = leg.startLocation?.name ?? t("UnnamedLocation")
    const endName = leg.endLocation?.name ?? t("UnnamedLocation")
    if (leg.isTransit) {
        return (
            <div className={mipConcatenate(styles.transit_leg_description, fixed || open ? styles.open : null)}>
                <img className={styles.path_icon}
                    src={iconUrl} alt={description} />
                <div>
                    {translateUnixTime(lang, leg.startTime)}
                </div>
                <div>
                    <div className={styles.title}>
                        <div className={styles.plate} style={{
                            color: leg.routeTextColor,
                            backgroundColor: leg.routeColor,
                            borderColor: leg.borderColor
                        }}>{leg.transitRouteName}
                        </div>
                        {leg.agencyUrl ?
                            <div><a href={leg.agencyUrl} target="_blank" rel="noopener noreferrer">
                                {leg.agencyName}
                            </a></div>
                            :
                            <div>{leg.agencyName}</div>
                        }
                    </div>
                    <div className={styles.title}>
                        {leg.headsign}
                    </div>
                    <div className={styles.title}>{t("FromLocation", {name: startName})}</div>
                    <div className={styles.title}>{t("ToLocation", {name: endName})}</div>
                </div>
                {open ?
                    <img className={styles.path_icon}
                        src="/path-icons/leg-closed.svg" alt="Chiudi" />
                    :
                    <img className={styles.path_icon}
                        src="/path-icons/leg-open.svg" alt="Apri" />
                }
            </div>
        )
    }
    return (
        <div className={mipConcatenate(styles.leg_header, fixed || open ? styles.open : null)}>
            <img className={styles.path_icon}
                src={iconUrl} alt={description?.iconAlt} />
            <div>
                <div>{t("ToLocation", {name: endName})}</div>
                <div>{translateDuration(lang, leg.duration_s)}</div>
                <div>{translateDistance(lang, leg.distance_m)}</div>
            </div>
            {!fixed && <>
                {open ?
                    <img className={styles.path_icon}
                        src="/path-icons/leg-closed.svg" alt="Chiudi" />
                    :
                    <img className={styles.path_icon}
                        src="/path-icons/leg-open.svg" alt="Apri" />
                }
            </>}
        </div>
    )
}

function MIPStepPanel({ step }) {
    return (
        <div className={styles.step_panel}>
            <img src={`/path-icons/${step.icon}.svg`} />
            <p className={styles.instruction}>
                {step.instruction?.map((instruction, idx) =>
                    <span key={idx} className={instruction[0] ? styles.emphasis : null}>
                        {instruction[1] + ' '}
                    </span>
                )}
            </p>
            <p className={styles.distance}>{step.distance}&nbsp;</p>
            <div className={styles.filler} />
        </div>
    )
}

function MIPStopPanel({ leg, stop }) {
    return (
        <div className={styles.stop_panel}>
            <div className={styles.time}>{stop.arrivalTime}</div>
            <div className={styles.stop_name}
                style={{
                    borderColor: leg.borderColor
                }}
            >
                {stop.name}
            </div>
        </div>
    )
}

function MIPLocationPanel({ location }) {
    return (
        <div className={styles.itinerary_location}>
            {location}
        </div>
    )
}

export default {
    Panel: MIPPlanPanel,
    ErrorPanel: MIPPlanMessages,
    PlanHeader: MIPPlanDescriptionPanel,
    LegHeader: MIPLegDescription
}