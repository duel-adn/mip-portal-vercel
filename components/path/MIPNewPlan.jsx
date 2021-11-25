/**
    (C) Duel srl 2021.

    Componenti per la presentazione del risultato del calcolo del percorso

    Revision history

    | Data       | Autore | Descrizione 
    | ---------- | ------ | ----------------------------------- |
    | 2021/11/03 | Duel   | Prima versione                      |
*/

import { translatePlanHeader, translateItineraryHeader , 
    translateLegHeader, translatePlanStep} from "../../lib/MIPPlanTranslator"

function MIPPlanPanel({ plan }) {
    return (
        <div className="mip-plan-panel">
            <MIPPlanError plan={plan} />
            {plan?.plan &&
                <MIPPlanHeader plan={plan.plan} />
            }
            {plan?.plan?.itineraries &&
                <MIPItinerariesPanel itineraries={plan.plan.itineraries} />
            }
        </div>
    )
}

function MIPPlanError({ plan }) {
    return (
        <>
            {plan?.error &&
                <div className="mip-error-message">{plan.error?.defaultMsg}</div>
            }
        </>
    )
}

function MIPPlanHeader({ plan }) {
    const hdr = translatePlanHeader('it', plan)
    return (
        <div className="mip-plan-header">
            <div>{hdr.fromLabel} <b>{hdr.fromName}</b></div>
            <div>{hdr.toLabel} <b>{hdr.toName}</b></div>
            <div>{hdr.departureLabel} <b>{hdr.departure}</b></div>
        </div>
    )
}

function MIPItinerariesPanel({ itineraries }) {
    console.log(itineraries?.length)
    return (
        <>
            {itineraries && (itineraries?.length == 1) &&
                <MIPItineraryPanel itinerary={itineraries[0]} />
            }
        </>
    )
}

function MIPItineraryPanel({ itinerary }) {
    return (
        <div>
            <MIPItineraryHeader itinerary={itinerary} />
            {itinerary?.legs && itinerary.legs.map((leg, idx) =>
                <MIPLegPanel key={leg?.id ?? idx} leg={leg} />
            )}
        </div>
    )
}

function MIPItineraryHeader({ itinerary }) {
    const hdr = translateItineraryHeader('it', itinerary)
    return (
        <div>
            <div>{hdr.duration}</div>
            <div>{hdr.distance}</div>
            <div>{hdr.arrival}</div>
        </div>
    )
}

function MIPLegPanel({ leg }) {
    console.log(leg)
    const hdr = translateLegHeader('it', leg)
    console.log(hdr)
    return (
        <div>
            <MIPLegHeader leg={leg} />
            {leg.steps && leg.steps.map((step, idx) => 
                <MIPStepPanel key={step.id ?? idx} step={step} />
            )}
        </div>
    )
}

function MIPLegHeader({ leg }) {
    const hdr = translateLegHeader('it', leg)
    return (
        <div>
            <div>{hdr.mode}</div>
            <div>{hdr.duration}</div>
            <div>{hdr.distance}</div>
        </div>
    )
}

function MIPStepPanel({ step }) {
    console.log(step)
    const stepTr = translatePlanStep('it', step)
    console.log(stepTr)
    return (
        <div>
            <img src={`/path-icons/${stepTr.icon}.svg`}/>
            <div>{stepTr.exit}</div>
            <div>{stepTr.instruction}</div>
        </div>
    )
}


const MIPPlan = {
    Panel: MIPPlanPanel,
    ErrorPanel: MIPPlanError,
    PlanHeader: MIPPlanHeader,
}

export default MIPPlan