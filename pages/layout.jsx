/**
    (C) Duel srl 2021.

    Pagina di test del layout.

    Revision history

    | Data       | Autore | Descrizione 
    | ---------- | ------ | ----------------------------------- |
    | 2021/08/10 | Duel   | Prima versione                      |
*/
import MIPPage from '../components/page/MIPPage'
import { Disclosure } from '@headlessui/react'
import { mipPathSearch } from '../components/path/MIPPathAPI'
import { mipFormatUnixTime , translateDuration, translateDistance } from '../lib/MIPUtility'

function AlternativeHeader({ num }) {
  return (
    <div className="path-header">
      <h3>pah {num}</h3>
      <p>time {num}</p>
      <hr />
    </div>
  )
}

function LegHeader({ num }) {
  return (
    <div className="leg-header">
      <h3>leg {num}</h3>
      <p>time {num}</p>
      <hr />
    </div>
  )
}

function ComplexStep({ path, leg, step }) {
  return (
    <div>
      <Disclosure>
        <Disclosure.Button><h5>Step {step}</h5></Disclosure.Button>
        <Disclosure.Panel>
          <p>Path {path} Leg {leg}</p>
          <p>Step 1</p>
          <p>Step 2</p>
          <p>Step 3</p>
        </Disclosure.Panel>

      </Disclosure>
    </div>
  )
}

function Step({ path, leg, step }) {
  return (
    <div>
      <h5>Step {step}</h5>
      <p>Path {path} Leg {leg}</p>

    </div>
  )
}

function Leg({ path, num }) {
  return (
    <div>
      <Disclosure>
        <Disclosure.Button><LegHeader path={path} leg={num} /></Disclosure.Button>
        <Disclosure.Panel>
          <Step path={path} leg={num} step={1} />
          <ComplexStep path={path} leg={num} step={2} />
          <Step path={path} leg={num} step={3} />
          <Step path={path} leg={num} step={4} />
        </Disclosure.Panel>
      </Disclosure>
    </div>
  )
}


function MIPPathStep({ step }) {
  return (
    <div>
      {JSON.stringify(step)}
    </div>
  )
}

function MIPPathLeg({ leg }) {
  return (
    <div>
      <div>Leg: {leg.id} {leg.start} - {leg.end}</div>
      {leg.steps && leg.steps.map(step =>
        <MIPPathStep key={step.id} step={step} />
      )}
    </div>
  )
}

function MIPItineraryLocation({ location }) {
  return (
    <div>
      <div>{location.name}</div>
    </div>
  )
}

function MIPItineraryDetails({ itinerary }) {
  return (
    <div className="mip-alernative-details">
      <MIPItineraryLocation location={itinerary.endLocation} />
      {itinerary.legs && itinerary.legs.map(leg =>
        <MIPPathLeg key={leg.id} leg={leg} />
      )}
      <MIPItineraryLocation location={itinerary.startLocation} />
    </div>
  )
}

function MIPItineraryPanel({ className, itinerary }) {
  return (
    <Disclosure.Panel className={className}>
      <MIPItineraryHeader itinerary={itinerary} />
      <MIPItineraryDetails className="mip-alernative-details" itinerary={itinerary} />
    </Disclosure.Panel>
  )
}

function MIPItineraryHeader({ itinerary, ...otherProps }) {
  return (
    <Disclosure.Button className="mip-itinerary-header" {...otherProps}>
      <img src="/icons/car-black.svg" />
      <div className="mip-itinerary-data">
        <p>Description {itinerary.id}</p>
        <p>Partenza {mipFormatUnixTime(itinerary.startTime)}</p>
      </div>
      <div className="mip-itinerary-time">
        <div>{translateDuration(itinerary?.duration_s)}</div>
        <div>{translateDistance(itinerary?.totalDistance_m)}</div>
      </div>
    </Disclosure.Button>
  )
}

function MIPPlanPanel({ plan }) {
  return (
    <>
      <div className="mip-plan-panel">
      {plan?.error && <div>{plan.error?.message}</div>}
      {plan?.plan?.itineraries && plan.plan.itineraries.map(alt =>
        <Disclosure key={alt.id} as="div" >
          {({ open }) =>
            <div key={alt.id}>
              <MIPItineraryHeader itinerary={alt} />
              {open && 
              <MIPItineraryPanel className={`mip-itinerary-panel${open ? ' open' : ''}`}
                itinerary={alt} />
              }
            </div>
          }
        </Disclosure>
      )}
      </div>
    </>
  )
}

// https://map.muoversinpiemonte.it/otp/routers/mip/plan?fromPlace=torino,+italia::45.059405,7.652514&toPlace=alessandria,+italia::44.910936,8.614124&mode=CAR&maxWalkDistance=2000&locale=IT
export default function Layout({ plan }) {
  return (
    <MIPPage.Page className="mip-home--" pageTitle="Layout test" >
      <section className="path-page">
        <div className="path-dialog">{JSON.stringify(plan)}</div>
        <MIPPlanPanel plan={plan} />
        {/* <div>{plan.from} + {plan.to}</div> */}
      </section>
    </MIPPage.Page >
  )
}

export async function getServerSideProps(context) {
  const plan = await mipPathSearch('IT', 'torino, italia', [7.652514, 45.059405],
    'alessandria, italia', [8.61412, 44.910936], 'CAR')
  console.log(plan)
  return {
    props: {
      plan: plan,
    },
  }
}

