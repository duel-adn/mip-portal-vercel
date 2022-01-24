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

import { MIPPlanMode, mipPathSearch } from '../lib/MIPPlannerAPI'

const options = [
  {value: "1", label: "one"},
  {value: "2", label: "two"},
  {value: "3", label: "three"},
  {value: "4", label: "four"},
  {value: "5", label: "five"},
]

// https://map.muoversinpiemonte.it/otp/routers/mip/plan?fromPlace=torino,+italia::45.059405,7.652514&toPlace=alessandria,+italia::44.910936,8.614124&mode=CAR&maxWalkDistance=2000&locale=IT
// http://mip-r-loadb-14949k90kol75-1272452334.eu-south-1.elb.amazonaws.com:9091/otp/routers/mip/plan?fromPlace=torino,+italia::45.059405,7.652514&toPlace=alessandria,+italia::44.910936,8.614124&mode=CAR&maxWalkDistance=2000&locale=IT
export default function Layout({ plan }) {
  return (
    <MIPPage.Page className="mip-home--" pageTitle="Layout test" >
      <div className='mip-tmp-panel'>

      </div>
    </MIPPage.Page >
  )
}
