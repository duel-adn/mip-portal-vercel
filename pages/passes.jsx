/**
    Duel S.p.A.

    Pagina traffico in tempo reale

    Revision history

    | Data       | Autore | Descrizione 
    | ---------- | ------ | ----------------------------------- |
    | 2021/08/10 | Duel   | Prima versione                      |
*/

import MIPPage from '../components/page/MIPPage';
import MIPPassDataPanel from '../components/pass/MIPPassDataPanel'
import MIPPassMapPanel from '../components/pass/MIPPassMapPanel';
import MIPLegend from '../components/forms/MIPLegend';
import { fetchPassData } from '../components/pass/MIPPassDataList';

const items = [
  {
      title: 'Colle chiuso',
      icon: 'pass-closed'
  },
  {
      title: 'Colle con chisura programmata',
      icon: 'pass-future-close'
  },
  {
      title: 'Colle aperto',
      icon: 'pass-open'
  },
]

export default function Passes({passData}) {
  return (
    <MIPPage.Page className="mip-traffic-page"
      pageTitle="Colli alpini"
      title="Colli alpini"
        titleClassName="mip-bg-accent"
        breadcrumb='Indietro'>
          <MIPPassDataPanel 
            headerClassName="mip-tl-rounded-corners mip-bg-accent"
            contentClassName="mip-bl-rounded-corners mip-bg-light"
            title="Colli alpini"
            titleIcon="traffic"
            subtitle="Scopri informazioni su colli e trafori"
            enableSearch={true}
            searchPlaceholder="Seleziona un colle" 
            passData={passData}/>
      <MIPPassMapPanel className="map-panel" passData={passData}/>
      <MIPLegend className="legend-panel mip-rounded-corners" items={items}/>
    </MIPPage.Page>
  )
}

export async function getServerSideProps(context) {
  const passData = await fetchPassData(context)

  return {
      props: {
        passData
    }
  }
}
  