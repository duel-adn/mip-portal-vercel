/**
    Duel S.p.A.

    Pagina traffico in tempo reale

    Revision history

    | Data       | Autore | Descrizione 
    | ---------- | ------ | ----------------------------------- |
    | 2021/08/10 | Duel   | Prima versione                      |
*/

import MIPPage from '../components/page/MIPPage';
import MIPTrafficTabPanel from '../components/traffic/MIPTrafficTabPanel'
import MIPTrafficMapPanel from '../components/traffic/MIPTrafficMapPanel';
import MIPLegend from '../components/forms/MIPLegend';
import { mipFetchTrafficEventData } from '../components/traffic/MIPTrafficAPI'
import MIPPath from '../components/path/MIPPath';
import MIPPlan from '../components/path/MIPPlan'
import { useState } from 'react';
import { MIPPlanMode, mipPathSearch } from '../components/path/MIPPathAPI'
import MIPPlanMapPanel from '../components/path/MIPPlanMapPanel';

export default function Peth(props) {
  const [plan, setPlan] = useState(null)
  const pathPlan = async (startLocation, startCoords, endLocation, endCoords, mode) => {
    const plan = await mipPathSearch('IT', startLocation, startCoords,
    endLocation, endCoords, 
    mode, true)
    console.log(plan)
    setPlan(plan)
  }

  return (
    <MIPPage.Page className="mip-traffic-page"
      pageTitle="Calcolo percorso"
      title="Calcolo del percorso"
        titleClassName="mip-bg-blue"
        breadcrumb='Indietro'>
      <section className="path-results">
        <MIPPath.Controller title="Calcolo percorso" onPathPlan={pathPlan}/>
        <MIPPlan.Panel plan={plan} />
      </section>
          <MIPPlanMapPanel className="map-panel" plan={plan} itineraries={plan?.itineraries}/>
    </MIPPage.Page>
  )
}

// export async function getServerSideProps(context) {
//   const eventData = await mipFetchTrafficEventData(context)

//   return {
//     props: {
//       eventData,
//     },
//   }
// }
