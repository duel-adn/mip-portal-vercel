/**
    (C) Duel srl 2021.

    Componenti per la presentazione del risultato del calcolo del percorso

    Revision history

    | Data       | Autore | Descrizione 
    | ---------- | ------ | ----------------------------------- |
    | 2021/11/03 | Duel   | Prima versione                      |
*/

import styles from "./MIPPlan.module.scss"
import { Fragment, useContext } from "react"
import { Disclosure } from "@headlessui/react"
import useTranslation from 'next-translate/useTranslation'

import { mipConcatenate } from "../../lib/MIPUtility"
import { I18NNamespace, translateDistance, translateDuration, translateUnixDateTime, translateUnixTime } from "../../lib/MIPi18N"

import MIPPath from "./MIPPath"
import { MIPErrorCode } from "../../lib/MIPErrorHandling"

const PlanColors = ["#0061B2", "#DA3463", "#00B431", "#F9C900"]

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
 * 
 * @param {Object} plan piano da mostrare
 * @returns un elemento React con i dati degli itinerari
 */
function MIPItinerariesPanel({ plan }) {
    const { t, lang } = useTranslation(I18NNamespace.PLANNER)
    const itineraries = plan?.itineraries
    return (<>
        {(itineraries?.length > 0) && itineraries.map((itn, idx) =>
            <Disclosure key={itn?.id ?? idx}>
                {({ open }) => <>
                    <Disclosure.Button>
                        <MIPItineraryDescriptionPanel itinerary={itn} />
                    </Disclosure.Button>
                    {open &&
                    <Disclosure.Panel id={itn.id} className={mipConcatenate(styles.itinerary_panel, open ? styles.open : null)}>
                        <Disclosure.Button aria-label={t("OpenPanel")}>
                            <MIPPlanDescriptionPanel plan={plan} />
                        </Disclosure.Button>
                        <div className={styles.itinerary_details}>
                            <MIPItineraryDescriptionPanel open={open} itinerary={itn} />
                            <div className={styles.location_header}>{plan?.startLocation?.name}</div>
                            {itn.legs?.length > 0 && itn.legs.map((leg, idx) =>
                                <MIPLegPanel key={leg?.id ?? idx} leg={leg} />
                            )}
                            <div className={styles.location_header}>{plan?.endLocation?.name}</div>
                        </div>
                    </Disclosure.Panel>
                    }
                </>}
            </Disclosure>
        )}
    </>)
}

/**
 * Pannello usato per mostrare i dati riassuntivi di un itinerario
 * 
 * @param {Boolean} open flag che dice se il pannello è aperto
 * @param {Object} itinerary itinerario da mostrare
 * @returns elemento React
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
                <div>{translateDuration(lang, itinerary.duration_s)}</div>
                <div>{translateDistance(lang, itinerary.distance_m)}</div>
            </div>
            {!open &&
                <div className={styles.cta}>{t("Details")}</div>
            }
        </div>
    )
}

/**
 * Riassunto delle leg di un itinerario in forma grafica
 * @param {Object} pictogram la rappresentazione dell'itinerario
 * @returns elemento React
 */
function MIPItineraryPictogram({ pictogram }) {
    const { t } = useTranslation(I18NNamespace.PLANNER)
    return ( pictogram ?
        <div className={styles.pictogram}>
            {pictogram && pictogram.map((pict, idx) => <Fragment key={idx}>
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
            </Fragment>)}
        </div>
        : null
    )
}

/**
 * Pannello usato per mostrare i dati di una Leg
 * 
 * @param {String} locale locale per la traduzione
 * @param {Object} leg itinerario da mostrare
 * @returns elemento React
 */
function MIPLegPanel({ leg }) {
    return (
        <Disclosure>
            {({ open }) => <>
                <Disclosure.Button className={mipConcatenate(styles.leg_expand_button, open ? styles.panel_open : null)}>
                    <MIPLegDescriptionPanel leg={leg} open={open} expandable />
                </Disclosure.Button>
                <Disclosure.Panel>
                    {leg.steps && leg.steps.map((step, idx) =>
                        <MIPStepPanel key={step.id ?? idx} step={step} />
                    )}
                    <div>
                    {leg.isTransit &&
                        <MIPStopPanel leg={leg} stop={leg.startLocation} icon="step-in" />
                    }
                    {leg.intermediateStops && leg.intermediateStops.map((stop, idx) =>
                        <MIPStopPanel key={stop.id ?? idx} leg={leg} stop={stop} />
                    )}
                    {leg.isTransit &&
                       <MIPStopPanel leg={leg} stop={leg.endLocation} icon="step-out" />
                    }
                    </div>
                </Disclosure.Panel>
            </>}
        </Disclosure>
    )
}

/**
 * Pannello di descrizione di una leg
 * @param {Object} leg la leg da descrivere 
 * @param {Boolean} open true se il pannello è aperto
 * @param {Boolean} expandable true se il pannello può essere espanso
 * @returns elemento React
 */
function MIPLegDescriptionPanel({ leg, open, expandable }) {
    const { t, lang } = useTranslation(I18NNamespace.COMMON)
    return (
        <div className={mipConcatenate(styles.leg_header, expandable ? null : styles.map_panel)}>
            {leg.isTransit ?
                <MIPTransitLegHeader leg={leg} />
                :
                <MIPLegHeader leg={leg} />
            }
            {expandable && (open ?
                <img className={styles.path_icon}
                    src="/path-icons/close-panel.svg" aria-hidden={true} alt={t("Open")} />
                :
                <img className={styles.path_icon}
                    src="/path-icons/open-panel.svg" aria-hidden={true} alt={t("Closed")} />
            )}
        </div>
    )
}

function MIPLegDescription({leg}) {
    const { t } = useTranslation(I18NNamespace.COMMON)
    return (
        <div className={styles.leg_header} style={{padding: ".5rem 0"}}>
            {leg.isTransit ?
                <MIPTransitLegHeader leg={leg} />
                :
                <MIPLegHeader leg={leg} />
            }
    </div>
    )
}

/**
 * Descrizione generale di una leg di tipo transit
 * @param {Object} leg leg da descrivere
 * @returns elemento React
 */
function MIPTransitLegHeader({ leg }) {
    const { t, lang } = useTranslation(I18NNamespace.PLANNER)
    const iconUrl = "/path-icons/" + t(`LegMode.${leg.mode}.Icon`) + ".svg"
    const description = t(`LegMode.${leg.mode}.Description`)
    const startName = leg.startLocation?.name ?? t("UnnamedLocation")
    const endName = leg.endLocation?.name ?? t("UnnamedLocation")
    return (
        <>
            <img className={styles.path_icon} src={iconUrl} alt={description} />
            <div>{translateUnixTime(lang, leg.startTime)}</div>
            <div>
                <div>
                    <span className={styles.plate} style={{
                        color: leg.routeTextColor,
                        backgroundColor: leg.routeColor,
                        borderColor: leg.borderColor
                    }}>{leg.transitRouteName}
                    </span>
                    {leg.agencyUrl ?
                        <a href={leg.agencyUrl} target="_blank" rel="noopener noreferrer">
                            {leg.agencyName}
                        </a>
                        :
                        <span>{leg.agencyName}</span>
                    }
                </div>
                <div>{leg.headsign}</div>
                <div>{t("FromLocation", { name: startName })}</div>
                <div>{t("ToLocation", { name: endName })}</div>
            </div>
        </>
    )
}

/**
 * Descrizione generale di una leg di tipo diverso da transit
 * @param {Object} leg leg da descrivere
 * @returns elemento React
 */
function MIPLegHeader({ leg }) {
    const { t, lang } = useTranslation(I18NNamespace.PLANNER)
    const iconUrl = "/path-icons/" + t(`LegMode.${leg.mode}.Icon`) + ".svg"
    const description = t(`LegMode.${leg.mode}.Description`)
    const endName = leg.endLocation?.name ?? t("UnnamedLocation")
    return (
        <>
            <img className={styles.path_icon} src={iconUrl} alt={description} />
            <div className={styles.title}>
                <div>{t("ToLocation", { name: endName })}</div>
                <div>{translateDuration(lang, leg.duration_s)}</div>
                <div>{translateDistance(lang, leg.distance_m)}</div>
            </div>
        </>
    )
}

/**
 * De
 * @returns elemento React
 * 
 */
function MIPStepPanel({ step }) {
    const { t, lang } = useTranslation(I18NNamespace.PLANNER)
    const direction = step.instruction?.direction ? t(`Instruction.${step.instruction.direction}`) : null
    const absoluteDirection = step.instruction?.absoluteDirection ? t(`Instruction.${step.instruction.absoluteDirection}`) : null
    const exit = step.instruction?.exit ? t(`Instruction.${step.instruction.exit}`) : null
    const translation = step.instruction ? t(`Instruction.${step.instruction.instruction}`, 
        { streetName: step.instruction?.streetName, direction, absoluteDirection, exit }) : null
    return (translation ? 
        <div className={styles.step_panel}>
            <img className={styles.icon} src={`/path-icons/${step.icon}.svg`} />
            <div className={styles.instruction}>{translation}</div>
            <div className={styles.distance}>{translateDistance(lang, step.distance_m)}&nbsp;</div>
            <div className={styles.filler} />
        </div>
        :null
    )
}

/**
 * Descrizione di una fermata per le leg di tipo transit
 * @param {Object} leg la leg che contiene la fermata
 * @param {Object} stop i dati della fermata
 * @param {String} icon il nome dell'icona
 * @returns elemento React
 * 
 */
function MIPStopPanel({ leg, stop, icon }) {
    const { t, lang } = useTranslation(I18NNamespace.PLANNER)
    return (
        <div className={styles.stop_panel}>
            {icon &&
                <img className={styles.icon} src={`/path-icons/${icon}.svg`} aria-hidden={true} />
            }
            <div className={styles.time}>{translateUnixTime(lang, stop.arrival)}</div>
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

export default {
    Panel: MIPPlanPanel,
    ErrorPanel: MIPPlanMessages,
    PlanHeader: MIPPlanDescriptionPanel,
    LegHeader: MIPLegDescriptionPanel
}