/**
    (C) Duel srl 2021.

    Pagina di test del layout.

    Revision history

    | Data       | Autore | Descrizione 
    | ---------- | ------ | ----------------------------------- |
    | 2021/08/10 | Duel   | Prima versione                      |
*/
import MIPPage from '../components/page/MIPPage'
import MIPPlan from '../components/path/MIPPlan'

import { MIPPlanMode, mipPathSearch } from '../components/path/MIPPathAPI'
import MIPPath from '../components/path/MIPPath'


// https://map.muoversinpiemonte.it/otp/routers/mip/plan?fromPlace=torino,+italia::45.059405,7.652514&toPlace=alessandria,+italia::44.910936,8.614124&mode=CAR&maxWalkDistance=2000&locale=IT
// http://mip-r-loadb-14949k90kol75-1272452334.eu-south-1.elb.amazonaws.com:9091/otp/routers/mip/plan?fromPlace=torino,+italia::45.059405,7.652514&toPlace=alessandria,+italia::44.910936,8.614124&mode=CAR&maxWalkDistance=2000&locale=IT
export default function Layout({ plan }) {
  return (
    <MIPPage.Page className="mip-home--" pageTitle="Layout test" >
      <section className="path-page">
        <MIPPath.Controller title="Calcolo percorso"/>
        <MIPPlan.Panel plan={plan} />
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

