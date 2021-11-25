/**
    (C) Duel srl 2021.

    Pagina di test del layout.

    Revision history

    | Data       | Autore | Descrizione 
    | ---------- | ------ | ----------------------------------- |
    | 2021/08/10 | Duel   | Prima versione                      |
*/
import MIPPage from '../components/page/MIPPage'
import MIPPlan from '../components/path/MIPNewPlan'

import { Disclosure } from '@headlessui/react'
import { mipPathSearch } from '../components/path/MIPPathAPI'
import { mipFormatUnixTime , translateDuration, translateDistance } from '../lib/MIPUtility'
import {humanizeDistance } from '../components/path/MIPPlan'
function MIPPathStep({ step }) {
  return (
    <div>
      <div>{step.distance_m}</div>
      <img src={`/path-icons/${step.icon}.svg`}/>
      <span>{step.instruction} per {humanizeDistance(step.distance_m)}</span>
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
        <p>{itinerary.description} {itinerary.id}</p>
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
//http://mip-r-loadb-10alxsxszfsvz-2064993841.eu-south-1.elb.amazonaws.com:9091/otp/routers/mip/plan?fromPlace=torino,+italia::45.059405,7.652514&toPlace=alessandria,+italia::44.910936,8.614124&mode=CAR&maxWalkDistance=2000&locale=IT
export default function Layout({ plan }) {
  return (
    <MIPPage.Page className="mip-home--" pageTitle="Layout test" >
      <section className="path-page">
        <div className="path-dialog">
          <button>Load</button>
        </div>
        <MIPPlan.Panel plan={plan} />
        <div>{plan.from} + {plan.to}</div>
      </section>
    </MIPPage.Page >
  )
}

export async function getServerSideProps(context) {
  const plan = await mipPathSearch('IT', 'torino, italia', [7.652514, 45.059405],
    'alessandria, italia', [8.61412, 44.910936], 'CAR')
  return {
    props: {
      plan: plan,
    },
  }
}

