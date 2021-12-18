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
import MIPPass from '../components/pass/MIPPass'
import MIPPassMapPanel from '../components/pass/MIPPassMapPanel';
import { fetchPassData } from '../components/pass/MIPPassAPI';

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
    const { t, tl } = useTranslation('common')
    return (
    <MIPPage.Page className="mip-traffic-page"
      pageTitle={t("PassesTitleShort")}
      title={t("PassesTitle")}
        titleClassName="mip-bg-accent"
        breadcrumb='Indietro'>
          <MIPPass.Panel 
            headerClassName="mip-tl-rounded-corners mip-bg-accent"
            contentClassName="mip-bl-rounded-corners mip-bg-light"
            enableSearch={false}
            passData={passData}/>
      <MIPPassMapPanel className="map-panel" passData={passData}/>
      <MIPPass.Legend className="legend-panel mip-rounded-corners" />
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
  