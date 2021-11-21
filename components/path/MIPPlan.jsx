/**
    (C) Duel srl 2021.

    Componenti per la presentazione del risultato del calcolo del percorso

    Revision history

    | Data       | Autore | Descrizione 
    | ---------- | ------ | ----------------------------------- |
    | 2021/11/03 | Duel   | Prima versione                      |
*/

import styles from './MIPPlan.module.scss'
import moment from 'moment'
import { Disclosure, Tab } from '@headlessui/react'
import { mipConcatenate } from '../../lib/MIPUtility'

// http://dev.opentripplanner.org/apidoc/1.3.0/syntax_json.html

function isEmpty(plan) {
    return (!plan || !plan.plan.itineraries ||
        !plan.plan.itineraries.length) && !plan.error 
}

function isError(plan) {
    return plan && plan.error
}

function isValid(plan) {
    return !isEmpty(plan) && !isError(plan)
}

function getDepartureLocationName(plan) {
    return plan.from.name
}

function getArrivalLocationName(plan) {
    return plan.to.name
}

function getTime(date) {
    return moment(date).format('H:mm')
}

function humanizeDuration(duration_s) {
    const minutes = duration_s % 60
    const hours = Math.floor(duration_s / 3600) % 24
    const days =  Math.floor(duration_s / 3600 / 24)
    const daysDesc = days > 0 ? 
        `${days} ${days > 1 ? "giorni" : "giorno"}` : null
    const hoursDesc = hours > 0 ? 
    `${hours} ${hours > 1 ? "ore" : "ora"}` : null
    const minDesc = minutes > 0 ? 
    `${minutes} min.` : null
    return mipConcatenate(daysDesc, hoursDesc, minDesc)
}

function humanizeDistance(distance_m) {
    const meters = Math.floor(distance_m)
    const km = Math.floor(meters / 1000)
    return km == 0 ? meters + " m" : Math.round(meters/100)/10 + " Km"
}

function getLegDescription(leg) {
    return leg.from.name + ' -> ' + leg.to.name
}

function getStepDescription(step) {
    return humanizeDistance(step.distance_m)
}
/**
 * 
 * @param {Object} pl
 */
function MIPPPlanPanel({plan, showHeader}) {
    return (
        <div className={styles.plan_panel}>
            {isError(plan) &&
                <div className={styles.error_plan}>
                {`${plan.error.message}`}
                </div>
            }
            {isEmpty(plan) && 
                <div className={styles.empty_plan}>
                    Nessun piano disponibile
                </div>
            }
            {isValid(plan) && 
                <>
                <MIPPPlanHeader plan={plan.plan} />
                <MIPPPlanContainer plan={plan.plan} />
                </>
            }
        </div>
    )
}

function MIPPPlanHeader({plan}) {
    console.log(plan)
    return (
        <div className={styles.plan_header}>
            <div className={styles.departure}>{getDepartureLocationName(plan)}</div>
            <div className={styles.arrival}>{getArrivalLocationName(plan)}</div>
        </div>
    )
}
function MIPStepContainer({step}) {
    return (
        <div className={styles.step_container}>
            <img src={`/path-icons/${step.icon}.svg`} />
            <div className={styles.step_content}>
                <div>{step.instructions}</div>
                <div>{getStepDescription(step)}</div>
            </div>
        </div>
    )
}
function MIPLegContainer({leg}) {
    return (
        <div className={styles.leg_container}>
            <Disclosure>
          {({ open }) => (
            <>
              <Disclosure.Button className={styles.leg_header}>
                <div>{getLegDescription(leg)}</div>
                <div>{humanizeDistance(leg.distance_m)}/{humanizeDuration(leg.duration_s)}</div>
              </Disclosure.Button>
              <Disclosure.Panel className={styles.leg_panel}>
              {leg.steps && leg.steps.map((step, idx) => 
                    <MIPStepContainer key={idx} step={step} />
              )}
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
        </div>
    )
}

function MIPItineraryHeader({itinerary}) {
    return (
        <div className={styles.itinerary_header}>
            <div>{`${getTime(itinerary.startTime)}-${getTime(itinerary.endTime)}`}</div>
            <div>{humanizeDuration(itinerary.duration_s)}<br/></div>
        </div>
    )
}

function MIPItineraryContainer({itinerary}) {
    return (
        <div className={styles.itinerary_container}>
            {itinerary.legs && itinerary.legs.map(leg =>
                <MIPLegContainer key={leg.id} leg={leg} />
            )}
        </div>
    )
}
function MIPPPlanContainer({plan}) {
    return (
        <div className={styles.plan_container}>
            <Tab.Group>
                <Tab.List>
                {plan.itineraries && plan.itineraries.map(itinerary => 
                    <Tab key={itinerary.id} as="div">
                        <MIPItineraryHeader key={itinerary.id} itinerary={itinerary} />
                    </Tab>
                )}
                </Tab.List>
                <Tab.Panels>
                    {plan.itineraries && plan.itineraries.map(itinerary => 
                        <Tab.Panel key={itinerary.id}>
                            <MIPItineraryContainer  itinerary={itinerary} />
                        </Tab.Panel>
                    )}
                </Tab.Panels>
            </Tab.Group>
        </div>
    )
}

const MIPPlan = {
    Panel: MIPPPlanPanel,
    Plan: MIPPPlanContainer,
    itinerary: MIPItineraryContainer,
    Header: MIPPPlanHeader,
}

export default MIPPlan