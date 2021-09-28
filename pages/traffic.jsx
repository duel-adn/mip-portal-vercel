/**
    Duel S.p.A.

    Pagina traffico in tempo reale

    Revision history

    | Data       | Autore | Descrizione 
    | ---------- | ------ | ----------------------------------- |
    | 2021/08/10 | Duel   | Prima versione                      |
*/

import MIPPage from '../components/page/MIPPage';
import MIPTrafficLegend from '../components/traffic/MIPTrafficLegend'
import MIPTrafficTabPanel from '../components/traffic/MIPTrafficTabPanel'
//import MIPMapPanel from '../components/map/MIPMapPanel'
import { fetchTrafficEventData } from '../components/traffic/MIPTrafficEventList'
import MIPTrafficMapPanel from '../components/traffic/MIPTrafficMapPanel';

export default function Traffic(props) {
  return (
    <MIPPage className="mip-traffic-page"
      pageTitle="Traffico in tempo reale"
      title="Traffico in tempo reale"
        titleClassName="mip-bg-accent"
        breadcrumb='Indietro'>
      <MIPTrafficTabPanel className="event-panel" trafficEventData={props.eventData} selected={1}/>
      <MIPTrafficMapPanel className="map-panel" trafficEventData={props.eventData}/>
      <MIPTrafficLegend className="legend-panel mip-rounded-corners" />
    </MIPPage>
  )
}

export async function getStaticProps(context) {
  const eventData = await fetchTrafficEventData(context)

  return {
    props: {
      eventData,
    },
  }
}
