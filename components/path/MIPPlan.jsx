/**}
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
import { I18NNamespace, translateDistance, translateDuration, translateUnixDateTime, translateUnixTime } from "../../lib/MIPI18N"

import MIPPath from "./MIPPath"
import { MIPLegColor } from '../../lib/MIPPlannerAPI'
import { MIPErrorCode } from "../../lib/MIPErrorHandling"

/**
 * Pannelllo con i risultati di una pianificazione
 * 
 * @param {String} className nome della classe da aggiungere all'elemento esterno
 * @param {Boolean} displayHeader true se bisogna mostrare i dati riassuntivi del piano
 * @returns il componente React con i risultati del piano
 */
function MIPPlanPanel({ className, displayHeader }) {
    const { plan } = useContext(MIPPath.Context)
    return (
        <div className={mipConcatenate(className, styles.plan_panel)}>
            <MIPPlanMessages className={styles.plan_msg_panel} plan={plan} />
            {displayHeader &&
                <MIPPlanDescriptionPanel className={styles.plan_header} plan={plan?.plan} />
            }
            <MIPItinerariesPanel plan={plan?.plan} />
        </div>
    )
}

/**
 * Pannelllo con i messaggi (solo errori) provenienti dal planner
 * 
 * @param {Object} plan piano calcolato dal server 
 * @returns un elemento React con i messaggi di errore
 */
function MIPPlanMessages({ className, plan }) {
    const { t } = useTranslation(I18NNamespace.ERROR)
    return plan?.error ?
        <div className={className}>
            {t(plan.error.mipErrorCode ?? MIPErrorCode.MIP_INV_SRV_RESP)}
        </div>
        : null
}

/**
 * Componente che visualizza la descrizione del piano
 * 
 * @param {Object} plan piano generato dal PlanTranslator
 * 
 * @returns il componente React con ??a descrizione del piano
 */
function MIPPlanDescriptionPanel({ className, plan, onClick }) {
    const { t, lang } = useTranslation(I18NNamespace.PLANNER)
    return plan ?
        <div className={className} onClick={onClick}>
            <img src="/path-icons/plan-close.svg" alt="chiudi" />
            <div>
                <div>{t("From")} <b>{plan?.startLocation?.name ?? t("UnnamedLocation")}</b></div>
                <div>{t("To")} <b>{plan?.endLocation?.name ?? t("UnnamedLocation")}</b></div>
                <div>{t("StartTime")} <b>{translateUnixDateTime(lang, plan?.startTime ?? Date.now())}</b></div>
            </div>
        </div>
        : null
}

/**
 * Pannello che mostra i dettagli degli itinerari.
 * 
 * @param {Object} plan piano da mostrare
 * @returns un elemento React con i dati degli itinerari
 */
function MIPItinerariesPanel({ plan }) {
    const { focusedItinerary, setFocusedItinerary } = useContext(MIPPath.Context)
    const { selectedItinerary, setSelectedItinerary } = useContext(MIPPath.Context)
    const itineraries = plan?.itineraries
    const selectItinerary = (it) => {
        if (focusedItinerary?.id === it.id) {
            setSelectedItinerary(it)
        } else {
            setFocusedItinerary(it)
        }
    }
    return (<>
        {(itineraries?.length > 0) && itineraries.map((itn, idx) =>
            <MIPItineraryDescriptionPanel key={itn.is ?? idx} itinerary={itn} 
                color={focusedItinerary?.id === itn.id ?  MIPLegColor.SelectedPath : MIPLegColor.OtherPath} onClick={() => selectItinerary(itn)} />
        )}
        <MIPItineraryDetailsPanel plan={plan} itinerary={selectedItinerary} open onClick={() => setSelectedItinerary(null)} />
    </>)
}

/**
 * Pannello usato per mostrare i dati riassuntivi di un itinerario
 * 
 * @param {Boolean} open flag che dice se il pannello ?? aperto
 * @param {Object} itinerary itinerario da mostrare}
 * @returns elemento React
 */
function MIPItineraryDescriptionPanel({ itinerary, open, color, onClick }) {
    const { t, lang } = useTranslation(I18NNamespace.PLANNER)
    const { focusedItinerary, setFocusedItinerary } = useContext(MIPPath.Context)
    const { selectedItinerary, setSelectedItinerary } = useContext(MIPPath.Context)
    const selectItinerary= (it) => {
        setFocusedItinerary(it)
        setSelectedItinerary(it)
    }
    return itinerary ?
        <div className={styles.itinerary_header}
            style={color ? { borderLeft: `6px solid ${color}` } : null}
            onClick={onClick}>

            <img className={styles.path_icon}
                src={`/path-icons/${itinerary?.mode?.toLowerCase()}.svg`}
                alt={t(`ModeLabel.${itinerary.mode}`)} />
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
                <button className={styles.cta} onClick={() => selectItinerary(itinerary)}>{t("Details")}</button>
            }
        </div>
        : null
}

function MIPItineraryDetailsPanel({ plan, itinerary, open, onClick }) {
    return itinerary ?
        <div className={mipConcatenate(styles.itinerary_panel, open ? styles.open : null)}>
            <MIPPlanDescriptionPanel className={styles.plan_header} plan={plan} onClick={onClick} />
            <div className={styles.itinerary_details}>
                <MIPItineraryDescriptionPanel open itinerary={itinerary} />
                <div className={styles.location_header}>{plan?.startLocation?.name}</div>
                {itinerary.legs?.length > 0 && itinerary.legs.map((leg, idx) =>
                    <MIPLegPanel key={leg?.id ?? idx} leg={leg} />
                )}
                <div className={styles.location_header}>{plan?.endLocation?.name}</div>
            </div>
        </div>
        : null
}

/**
 * Riassunto delle leg di un itinerario in forma grafica
 * @param {Object} pictogram la rappresentazione dell'itinerario
 * @returns elemento React
 */
function MIPItineraryPictogram({ pictogram }) {
    const { t } = useTranslation(I18NNamespace.PLANNER)
    return (pictogram ?
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
                <MIPLegDescriptionPanel leg={leg} open={open} expandable />
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
 * @param {Boolean} open true se il pannello ?? aperto
 * @param {Boolean} expandable true se il pannello pu?? essere espanso
 * @returns elemento React
 */
function MIPLegDescriptionPanel({ leg, open, expandable }) {
    const { t, lang } = useTranslation(I18NNamespace.COMMON)
    return (
        <div className={mipConcatenate(styles.leg_header, expandable ? null : styles.map_panel, open ? styles.panel_open : null)}>
            {leg.isTransit ?
                <MIPTransitLegHeader leg={leg} />
                :
                <MIPLegHeader leg={leg} />
            }
            {expandable &&
                <Disclosure.Button className={mipConcatenate(styles.leg_expand_button, open ? styles.open : null)}>
                    <img className={styles.path_icon}
                        src="/path-icons/open-panel.svg" aria-hidden={true} alt={t("Closed")} />
                </Disclosure.Button>
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
                <div>{leg.routeShortName !== leg.transitRouteName ? leg.routeShortName : null}</div>
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
    const { zoomToPoint } = useContext(MIPPath.Context)
    const direction = step.instruction?.direction ? t(`Instruction.${step.instruction.direction}`) : null
    const absoluteDirection = step.instruction?.absoluteDirection ? t(`Instruction.${step.instruction.absoluteDirection}`) : null
    const exit = step.instruction?.exit ? t(`Instruction.${step.instruction.exit}`) : null
    const translation = step.instruction ? t(`Instruction.${step.instruction.instruction}`,
        { streetName: step.instruction?.streetName, direction, absoluteDirection, exit }) : null
    return (translation ?
        <div className={styles.step_panel} onClick={() => zoomToPoint(step.latLon)}>
            <img className={styles.icon} src={`/path-icons/${step.icon}.svg`} />
            <div className={styles.instruction}>{translation}</div>
            <div className={styles.distance}>{translateDistance(lang, step.distance_m)}&nbsp;</div>
            <div className={styles.filler} />
        </div>
        : null
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
    const { zoomToPoint } = useContext(MIPPath.Context)
    return (
        <div className={styles.stop_panel} onClick={() => zoomToPoint(stop.latLon)}>
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