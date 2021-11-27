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
import {
    translatePlanHeader, translateItineraryHeader,
    translateLegHeader, translatePlanStep,
    translatePlanErrors
} from "../../lib/MIPPlanTranslator"
import { style } from "dom-helpers"
import { mipConcatenate } from "../../lib/MIPUtility"

/**
 * Pannelllo con i risultati di una pianificazione
 * 
 * @param {String} locale lingua per la traduzione (default it)
 * @param {Object} plan piano calcolato dal server 
 * @param {Boolean} displayHeader true se bisogna mostrare i dati riassuntivi del piano
 * @returns il componente React con i risultati del piano
 */
function MIPPlanPanel({ locale, plan, displayHeader }) {
    return (
        <>
        {plan &&
        <div className={styles.plan_panel}>
            <MIPPlanMessages locale={locale} plan={plan} />
            {displayHeader && plan?.plan &&
                <MIPPlanHeader locale={locale} plan={plan.plan} />
            }
            {plan?.plan?.itineraries &&
                <MIPItinerariesPanel locale={locale} itineraries={plan.plan.itineraries} />
            }
        </div>
        }
        </>
    )
}

/**
 * Pannelllo con i messaggi (solo errori) provenienti dal planner
 * 
 * @param {String} locale lingua per la traduzione (default it)
 * @param {Object} plan piano calcolato dal server 
 * @returns un elemento React con i messaggi di errore
 */
 function MIPPlanMessages({ locale, plan }) {
    return (
        <>
            {plan?.error &&
                <div className={styles.plan_msg_panel}>
                    {translatePlanErrors(plan.error)}
                </div>
            }
        </>
    )
}

function MIPPlanHeader({ locale, plan }) {
    const hdr = translatePlanHeader('it', plan)
    return (
        <div className="mip-plan-header">
            <div>{hdr.fromLabel} <b>{hdr.fromName}</b></div>
            <div>{hdr.toLabel} <b>{hdr.toName}</b></div>
            <div>{hdr.departureLabel} <b>{hdr.departure}</b></div>
        </div>
    )
}

/**
 * Pannello che mostra i dettagli degli itinerari.
 * Se c'è un solo itinerario lo mostra, altrimenti mostra
 * dei disclosure panel che permettono di visualizzare i dettagli 
 * di ciascuno.
 * 
 * @param {String} locale lingua da usare per la traduzione
 * @param {Object} itineraries itinerari da mostrare
 * @returns un elemento React con i dati degli itinerari
 */
function MIPItinerariesPanel({ locale, itineraries }) {
    if (itineraries) {
        return (
            <>
                {(itineraries?.length == 1) &&
                    <>
                        <MIPItineraryHeader locale={locale} itinerary={itineraries[0]} />
                        <MIPItineraryPanel className={mipConcatenate(styles.itinerary_panel, styles.open)}
                            locale={locale} open={true} itinerary={itineraries[0]} />
                    </>
                }
                {(itineraries?.length > 1) && itineraries.map((itn, idx) =>
                    <Disclosure key={itn?.id ?? idx}>
                        {({ open }) =>
                            <>
                                <Disclosure.Button className={styles.itinerary_expand_button}>
                                    <MIPItineraryHeader locale={locale} itinerary={itn} />
                                </Disclosure.Button>
                                <Disclosure.Panel id={`itinerary-${idx}`} className={mipConcatenate(styles.itinerary_panel, open ? styles.open : null)}>
                                    <Disclosure.Button className={styles.itinerary_expand_button}>
                                        <MIPItineraryHeader locale={locale} open={open} itinerary={itn} />
                                    </Disclosure.Button>
                                    <MIPItineraryPanel locale={locale} itinerary={itn} />
                                </Disclosure.Panel>
                            </>
                        }
                    </Disclosure>
                )}
            </>
        )
    }
    return nulll
}

/**
 * Pannello usato per mostrare i dati riassuntivi di un itinerario
 * 
 * @param {String} locale locale per la traduzione
 * @param {Boolean} open flag che dice se il pannello è aperto
 * @param {Object} itinerary itinerario da mostrare
 * @returns 
 */
function MIPItineraryHeader({ locale, itinerary, open }) {
    const hdr = translateItineraryHeader(locale, itinerary)
    return (
        <div className={styles.itinerary_header}>
            <img class={styles.path_icon} src={hdr.modeIconUrl} alt={hdr.modeIconAlt}/>
            <div>
                {hdr?.description &&
                    <div className={styles.title}>{hdr.description}</div>
                }
                {hdr.departureTime && 
                    <div className={styles.title}>{hdr.departureTime}</div>
                }
                {hdr.arrivalTime && 
                    <div className={styles.title}>{hdr.arrivalTime}</div>
                }
            </div>
            <div className={styles.details}>
                <div className={styles.duration}>{hdr.duration}</div>
                <div className={styles.distance}>{hdr.distance}</div>
            </div>
            {!open &&
                <div className={styles.cta}>{hdr.cta}</div>
            }
        </div>
    )
}

function MIPItineraryPanel({ className, itinerary }) {
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
 function MIPLegPanel({ locale, fixed, leg }) {
    console.log(leg)
    const hdr = translateLegHeader(locale, leg)
    console.log(hdr)
    if (fixed) {
        return (
        <div>
            <MIPLegHeader locale={locale} leg={leg} fixed={fixed} />
            {leg.steps && leg.steps.map((step, idx) =>
                <MIPStepPanel key={step.id ?? idx} locale={locale} step={step} />
            )}
        </div>
        )
    }
    return (
        <Disclosure as="div" >
            {({ open }) =>
            <>
            <Disclosure.Button className={styles.leg_expand_button}>
                <MIPLegHeader locale={locale} leg={leg} open={open}/>
            </Disclosure.Button>
            <Disclosure.Panel>
                {leg.steps && leg.steps.map((step, idx) =>
                    <MIPStepPanel key={step.id ?? idx} locale={locale} step={step} />
                )}
            </Disclosure.Panel>
            </>
            }
        </Disclosure>
    )
}

function MIPLegHeader({ locale, leg, fixed, open }) {
    const hdr = translateLegHeader(locale, leg)
    return (
        <div className={mipConcatenate(styles.leg_header, fixed || open ? styles.open : null)}>
            <img className={styles.path_icon} src={hdr.iconUrl} alt={hdr.iconAlt}/>
            <div>
                <div>{hdr.shortDescription}</div>
                <div>{hdr.duration}</div>
                <div>{hdr.distance}</div>
            </div>
            {!fixed && <>
            {open ? 
            <img class={styles.path_icon} 
                src="/path-icons/leg-closed.svg" alt="Chiudi"/>
            :
            <img class={styles.path_icon} 
                src="/path-icons/leg-open.svg" alt="Apri"/>
            }
            </>}
        </div>
    )
}

function MIPStepPanel({ locale, step }) {
    console.log(step)
    const stepTr = translatePlanStep(locale, step)
    console.log(stepTr)
    return (
        <div className={styles.step_panel}>
            <img src={`/path-icons/${stepTr.icon}.svg`} />
            <div>
                <div>{stepTr.exit}</div>
                <div>{stepTr.instruction}</div>
            </div>
        </div>
    )
}


const MIPPlan = {
    Panel: MIPPlanPanel,
    ErrorPanel: MIPPlanMessages,
    PlanHeader: MIPPlanHeader,
}

export default MIPPlan