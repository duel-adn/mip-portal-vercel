/**
    Duel S.p.A.

    Pagina traffico in tempo reale

    Revision history

    | Data       | Autore | Descrizione 
    | ---------- | ------ | ----------------------------------- |
    | 2021/08/10 | Duel   | Prima versione                      |
*/

import useTranslation from 'next-translate/useTranslation'

import MIPPage from '../components/page/MIPPage';
import MIPTrafficTabPanel from '../components/traffic/MIPTrafficTabPanel'
import MIPTrafficMapPanel from '../components/traffic/MIPTrafficMapPanel';
import { mipFetchTrafficEventData } from '../components/traffic/MIPTrafficAPI'
import MIPTraffic from '../components/traffic/MIPTraffic';

export default function Traffic(props) {
    const { t, tl } = useTranslation('traffic')
    return (
    <MIPPage.Page className="mip-traffic-page"
      pageTitle={t("RealTime")}
      title={t("RealTime")}
        titleClassName="mip-bg-accent"
        breadcrumb={t("GoBack")}>
      <MIPTrafficTabPanel className="event-panel" trafficEventData={props.eventData} selected={1}/>
      <MIPTrafficMapPanel className="map-panel" trafficEventData={props.eventData}/>
      <MIPTraffic.Legend className="legend-panel mip-rounded-corners" />
    </MIPPage.Page>
  )
}

export async function getServerSideProps(context) {
  const eventData = await mipFetchTrafficEventData(context)

  return {
    props: {
      eventData,
    },
  }
}
