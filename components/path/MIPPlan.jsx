/**
    (C) Duel srl 2021.

    Componenti per la presentazione del risultato del calcolo del percorso

    Revision history

    | Data       | Autore | Descrizione 
    | ---------- | ------ | ----------------------------------- |
    | 2021/11/03 | Duel   | Prima versione                      |
*/

import styles from "./MIPPlan.module.scss"
import { Disclosure } from "@headlessui/react"
import { mipConcatenate } from "../../lib/MIPUtility"
import { Fragment } from "react"

/**
 * Pannelllo con i risultati di una pianificazione
 * 
 * @param {Object} plan piano calcolato dal server 
 * @param {Boolean} displayHeader true se bisogna mostrare i dati riassuntivi del piano
 * @returns il componente React con i risultati del piano
 */
function MIPPlanPanel({ plan, displayHeader }) {
    return (
        <div className={styles.plan_panel}>
            {plan?.error &&
                <MIPPlanMessages plan={plan} />
            }
            {displayHeader && plan &&
                <MIPPlanDescriptionPanel plan={plan} />
            }
            {plan?.itineraries &&
                <MIPItinerariesPanel plan={plan} />
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
    return (
        <>
            {plan?.error &&
                <div className={styles.plan_msg_panel}>
                    {plan.error.message}
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
    const description = plan.description
    return (
        <div className={styles.plan_header}>
            <img src="/path-icons/plan-close.svg" alt="chiudi" />
            <div>
                <div>{description.fromLabel} <b>{description.fromName}</b></div>
                <div>{description.toLabel} <b>{description.toName}</b></div>
                <div>{description.departureLabel} <b>{description.departureDateTime}</b></div>
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
    const itineraries = plan.itineraries
    if (itineraries) {
        return (
            <>
                {(itineraries?.length == 1) &&
                    <>
                        <MIPItineraryDescriptionPanel itinerary={itineraries[0].description} />
                        <MIPItineraryDetailsPanel className={mipConcatenate(styles.itinerary_panel, styles.open)}
                            open={true} itinerary={itineraries[0]} />
                    </>
                }
                {(itineraries?.length > 1) && itineraries.map((itn, idx) =>
                    <Disclosure key={itn?.id ?? idx}>
                        {({ open }) =>
                            <>
                                <Disclosure.Button className={styles.itinerary_expand_button}>
                                    <MIPItineraryDescriptionPanel itinerary={itn.description} />
                                </Disclosure.Button>
                                <Disclosure.Panel id={`itinerary-${idx}`} className={mipConcatenate(styles.itinerary_panel, open ? styles.open : null)}>
                                    <Disclosure.Button className={styles.itinerary_expand_button}>
                                        <MIPPlanDescriptionPanel plan={plan} />
                                    </Disclosure.Button>
                                    <MIPItineraryDescriptionPanel open={open} itinerary={itn.description} />
                                    <MIPItineraryDetailsPanel itinerary={itn} />
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
    const iconUrl = `/path-icons/${itinerary.iconName}.svg`
    return (
        <div className={styles.itinerary_header}>
            <img className={styles.path_icon} src={iconUrl} alt={itinerary.iconAlt} />
            <div>
                {itinerary?.description &&
                    <div className={styles.title}>{itinerary.description}</div>
                }
                {itinerary.departure &&
                    <div className={styles.title}>{itinerary.departure}</div>
                }
                {itinerary.arrival &&
                    <div className={styles.title}>{itinerary.arrival}</div>
                }
                <div className={styles.pictogram}>
                    {itinerary.pictogram && itinerary.pictogram?.map((pict, idx) =>
                        <div key={idx} className={styles.pictogram}>
                            <img src={`/path-icons/${pict.iconName}.svg`} alt={pict.iconName} />
                            {pict.name && 
                            <div className={styles.plate} style={{
                                color: pict.textColor,
                                backgroundColor: pict.color,
                                borderColor: pict.borderColor
                            }}>{pict.name}
                            </div>
                            }
                                {idx != itinerary.pictogram.length - 1 &&
                                    <div className={styles.separator}>&gt;</div>
                                }
                        </div>
                    )}
                </div>
            </div>
            <div className={styles.details}>
                <div className={styles.duration}>{itinerary.duration}</div>
                <div className={styles.distance}>{itinerary.distance}</div>
            </div>
            {!open &&
                <div className={styles.cta}>{itinerary.detailsLabel}</div>
            }
        </div>
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
            <div>
                <MIPLegDescription leg={leg.description} fixed={fixed} />
                {leg.steps && leg.steps.map((step, idx) =>
                    <MIPStepPanel key={step.id ?? idx} step={step} />
                )}
            </div>
        )
    }
    return (
        <Disclosure as="div" >
            {({ open }) =>
                <>
                    <Disclosure.Button className={styles.leg_expand_button}>
                        <MIPLegDescription leg={leg} open={open} />
                    </Disclosure.Button>
                    <Disclosure.Panel>
                        {leg.steps && leg.steps.map((step, idx) =>
                            <MIPStepPanel key={step.id ?? idx} step={step} />
                        )}
                        {leg.stops && leg.stops.map((stop, idx) =>
                            <MIPStopPanel key={stop.id ?? idx} stop={stop} />
                        )}
                    </Disclosure.Panel>
                </>
            }
        </Disclosure>
    )
}

function MIPLegDescription({ leg, fixed, open }) {
    const description = leg.description
    const iconUrl = `/path-icons/${description?.iconName}.svg`
    return (
        <div className={mipConcatenate(styles.leg_header, fixed || open ? styles.open : null)}>
            <img className={styles.path_icon}
                src={iconUrl} alt={description.iconAlt} />
            <div>
                <div>{description.shortDescription}</div>
                <div>{description.destination}</div>
                <div>{description.duration}</div>
                <div>{description.distance}</div>
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

function MIPStopPanel({ stop }) {
    return (
        <div className={styles.step_panel}>
            <p className={styles.instruction}>
                {stop.departureTime} {stop.name}
            </p>
        </div>
    )
}


const MIPPlan = {
    Panel: MIPPlanPanel,
    ErrorPanel: MIPPlanMessages,
    PlanHeader: MIPPlanDescriptionPanel,
}

export default MIPPlan