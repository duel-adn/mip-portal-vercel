/**
    (C) Duel srl 2021.

    Pagina delle notizie del trasporto pubblico locale.

    Revision history

    | Data       | Autore | Descrizione 
    | ---------- | ------ | ----------------------------------- |
    | 2021/08/10 | Duel   | Prima versione                      |
*/

import MIPPage from '../components/page/MIPPage'
import MIPTPLServiceList from '../components/tpl/MIPTPLServiceList'

export default function Tpl(props) {
  return (
    <MIPPage
      title="Trasporto pubblico" 
      titleClassName="mip-bg-blue"
      breadcrumb='Indietro'>
        <MIPTPLServiceList />
    </MIPPage>
  )
}

export async function getStaticProps(context) {
  // const eventData = null //await fetchTrafficEventData(context)
  // const weatherData = await fetchWeatherData(context)
  // const publicTransportData = null //await fetchPublicTransportData(context)
  
  // return {
  //   props: {
  //     eventData,
  //     weatherData,
  //     publicTransportData
  //   },
  // }
  return {props: {}}
}
