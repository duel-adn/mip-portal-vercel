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
import MIPTrafficMapPanel from '../components/traffic/MIPTrafficMapPanel';
import { mipFetchTrafficEventData } from '../components/traffic/MIPTrafficAPI'
import MIPTraffic from '../components/traffic/MIPTraffic';

export default function Traffic({ eventData }) {
  const { t, tl } = useTranslation('traffic')
  return (
    <MIPPage.Page className="mip-traffic-page"
      pageTitle={t("RealTimeTitle")}
      title={t("RealTime")}
      titleClassName="mip-bg-accent"
      breadcrumb={t("GoBack")}>
      <MIPTraffic.Controller eventData={eventData}>
        <MIPTraffic.Panel className="event-panel mip-tl-rounded-corners" headerClass="mip-bg-accent"
          title={t("RealTimeShort")}
          trafficEventData={eventData}
          searchable />

        {/* <MIPTrafficTabPanel className="event-panel" trafficEventData={props.eventData} selected={1}/> */}
        <MIPTrafficMapPanel className="map-panel" trafficEventData={eventData} />
      </MIPTraffic.Controller>
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
