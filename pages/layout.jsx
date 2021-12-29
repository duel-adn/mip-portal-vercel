/**
    (C) Duel srl 2021.

    Pagina di test del layout.

    Revision history

    | Data       | Autore | Descrizione 
    | ---------- | ------ | ----------------------------------- |
    | 2021/08/10 | Duel   | Prima versione                      |
*/
import { useState } from 'react'
import MIPPage from '../components/page/MIPPage'
import MIPPlan from '../components/path/MIPPlan'
import AsyncSelect from 'react-select/async';

import { MIPPlanMode, mipPathSearch } from '../lib/MIPPlannerAPI'
import MIPPath from '../components/path/MIPPath'
import MIPAddressAutocompleteInput from '../components/path/MIPAddressAutocompleteInput'

const options = [
  {value: "1", label: "one"},
  {value: "2", label: "two"},
  {value: "3", label: "three"},
  {value: "4", label: "four"},
  {value: "5", label: "five"},
]

const loadOptions = async (inputValue, callback) => {
  const rawData = options
  if (rawData instanceof Error) {
      // TODO: show error on control
      console.log('error' + rawData)
      return
  }
  callback(rawData)
}
// https://map.muoversinpiemonte.it/otp/routers/mip/plan?fromPlace=torino,+italia::45.059405,7.652514&toPlace=alessandria,+italia::44.910936,8.614124&mode=CAR&maxWalkDistance=2000&locale=IT
// http://mip-r-loadb-14949k90kol75-1272452334.eu-south-1.elb.amazonaws.com:9091/otp/routers/mip/plan?fromPlace=torino,+italia::45.059405,7.652514&toPlace=alessandria,+italia::44.910936,8.614124&mode=CAR&maxWalkDistance=2000&locale=IT
export default function Layout({ plan }) {
  const [startLocation, setStartLocation] = useState({value:"satrt", label:"start label"})
  const [endLocation, setEndLocation] = useState({value:"end", label:"end label"})
  const [swapped, setSwapped] = useState(false)
  return (
    <MIPPage.Page className="mip-home--" pageTitle="Layout test" >
      <section className="path-page">
        <label >Swap</label> 
      {/* <input type="checkbox"onChange={() => setSwapped(!swapped)}/> */}
      <input type="checkbox"onChange={() => { const t = startLocation; setStartLocation(endLocation); setEndLocation(t)}}/>
      <div>{swapped}</div>
      {!swapped && 
      <>
      <AsyncSelect 
        placeholder="start" 
        value={startLocation} 
        onChange={setStartLocation} 
        defaultOptions
        loadOptions={loadOptions}
        />
      <div>{JSON.stringify(startLocation)}</div>
      <AsyncSelect 
        placeholder="end" 
        value={endLocation} 
        onChange={setEndLocation} 
        defaultOptions
        loadOptions={loadOptions}
        />
      <div>{JSON.stringify(endLocation)}</div>
      </>
}
{swapped && 
      <>
      <MIPAddressAutocompleteInput className="mip-bg-blue" 
                    searchString={endLocation?.label} setSearchString={setStartLocation}
                    icon='/icons/path-dest.svg'
                    placeholder="End" loadingMsg="Loading"
                    onChange={setEndLocation} />
      <div>{JSON.stringify(endLocation)}</div>
      <MIPAddressAutocompleteInput className="mip-bg-blue" 
                    searchString={startLocation?.label} setSearchString={setStartLocation}
                    icon='/icons/path-start.svg'
                    placeholder="Start" loadingMsg="Loading"
                    onChange={setStartLocation} />
      <div>{JSON.stringify(startLocation)}</div>
      </>
}
      </section>
    </MIPPage.Page >
  )
}

export async function getServerSideProps(context) {
  const plan = await mipPathSearch('IT', 'torino, italia', [7.652514, 45.059405],
    'alessandria, italia', [8.61412, 44.910936], 
    MIPPlanMode.publicTransport, true)

  return {
    props: {
      plan: plan,
    },
  }
}

