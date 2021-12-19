/**
    Duel S.p.A.

    Pagina pianificazione viaggio

    Revision history

    | Data       | Autore | Descrizione 
    | ---------- | ------ | ----------------------------------- |
    | 2021/08/10 | Duel   | Prima versione                      |
*/

import useTranslation from 'next-translate/useTranslation'

import MIPPage from '../components/page/MIPPage';
import MIPPath from '../components/path/MIPPath';
import MIPPlan from '../components/path/MIPPlan'
import MIPPlanMapPanel from '../components/path/MIPPlanMapPanel';

export default function Planner(props) {
  const { t } = useTranslation("planner")
  return (
    <MIPPage.Page className="mip-traffic-page"
      pageTitle={t("PlanPageTitle")}
      title={t("PlanPageTitle")}
      titleClassName="mip-bg-blue"
      breadcrumb={t("GoBack")}>
      <MIPPath.Controller title={t("PlanTitle")}>
        <section className="path-results">
          <MIPPath.DataForm className="mip-tl-rounded-corners"/>
          <MIPPlan.Panel />
        </section>
        <MIPPlanMapPanel className="map-panel"/>
      </MIPPath.Controller>
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
