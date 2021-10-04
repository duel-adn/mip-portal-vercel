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

const items = [
  {
      title: 'Traffico scorrevole',
      icon: 'no-traffic'
  },
  {
      title: 'Traffico intenso',
      icon: 'light-traffic'
  },
  {
      title: 'Rallentamenti',
      icon: 'heavy-traffic'
  },
  {
      title: 'Code',
      icon: 'queued-traffic'
  },
  {
      title: 'Allerta meteo',
      icon: 'weather-event'
  },
  {
      title: 'Incidente',
      icon: 'accident-event'
  },
  {
      title: 'Videocamera',
      icon: 'traffic-camera'
  },
  {
      title: 'Chiusure',
      icon: 'closure-event'
  },
]

export default function Traffic(props) {
  return (
    <MIPPage className="mip-traffic-page"
      pageTitle="Traffico in tempo reale"
      title="Traffico in tempo reale"
        titleClassName="mip-bg-accent"
        breadcrumb='Indietro'>
      <MIPTrafficTabPanel className="event-panel" trafficEventData={props.eventData} selected={1}/>
      <MIPTrafficMapPanel className="map-panel" trafficEventData={props.eventData}/>
      <MIPLegend className="legend-panel mip-rounded-corners" items={items}/>
    </MIPPage>
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
