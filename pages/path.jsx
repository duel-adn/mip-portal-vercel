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

export default function Traffic(props) {
  return (
    <MIPPage.Page className="mip-traffic-page"
      pageTitle="Calcolo percorso"
      title="Calcolo del percorso"
        titleClassName="mip-bg-blue"
        breadcrumb='Indietro'>
          <MIPPath.Controller className="mip-rounded-corners path-panel" title="Calcola il percorso" />
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
