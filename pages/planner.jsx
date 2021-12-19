/**
    Duel S.p.A.

    Pagina pianificazione viaggio

    Revision history

    | Data       | Autore | Descrizione 
    | ---------- | ------ | ----------------------------------- |
    | 2021/08/10 | Duel   | Prima versione                      |
*/

import { useState } from 'react';

import useTranslation from 'next-translate/useTranslation'

import MIPPage from '../components/page/MIPPage';
import MIPPath from '../components/path/MIPPath';
import MIPPlan from '../components/path/MIPPlan'
import { mipPathSearch } from '../components/path/MIPPathAPI'
import MIPPlanMapPanel from '../components/path/MIPPlanMapPanel';

export default function Planner(props) {
  const { t, lang } = useTranslation("planner")
  const [plan, setPlan] = useState(null)
  const pathPlan = async (startLocation, startCoords, endLocation, endCoords, mode) => {
    const plan = await mipPathSearch(lang, startLocation, startCoords,
      endLocation, endCoords,
      mode, true)
    console.log(plan)
    setPlan(plan)
  }

  return (
    <MIPPage.Page className="mip-traffic-page"
      pageTitle={t("PlanPageTitle")}
      title={t("PlanPageTitle")}
      titleClassName="mip-bg-blue"
      breadcrumb={t("GoBack")}>
      <section className="path-results">
        <MIPPath.Controller title={t("PlanTitle")} onPathPlan={pathPlan} />
        <MIPPlan.Panel plan={plan} />
      </section>
      <MIPPlanMapPanel className="map-panel" plan={plan} itineraries={plan?.itineraries} />
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
