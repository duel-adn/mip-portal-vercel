/**
    (C) Duel srl 2021.

    Pagina delle news.

    Revision history

    | Data       | Autore | Descrizione 
    | ---------- | ------ | ----------------------------------- |
    | 2021/08/10 | Duel   | Prima versione                      |
*/

import MIPPageHead from '../components/page/MIPPageHead'
import MIPPageHeader from '../components/header/MIPPageHeader'
import MIPPageFooter from '../components/footer/MIPPageFooter'
import MIPWeatherPanel, {fetchWeatherData} from '../components/weather/MIPWeatherPanel'
import MIPTPLServiceList from '../components/tpl/MIPTPLServiceList'

export default function Home(props) {
  return (
    <>
      <MIPPageHead title="Trasporto pubblico" />
      <MIPPageHeader className="mip-page-header" 
        title="Trasporto pubblico" 
        titleClassName="mip-bg-blue"
        breadcrumb='Indietro'/>
      <main className="mip-bg-light mip-page-main">
        <MIPTPLServiceList className="mip-page-row"/>
      </main>
      <div className="mip-mt-auto">
        <aside className="mip-page-section mip-weather-panel">
          <MIPWeatherPanel className="mip-page-row" weatherData={props.weatherData}/>
        </aside>
        <footer className="mip-page-footer mip-bg-blue">
          <MIPPageFooter className="mip-page-row" />
        </footer>
      </div>
    </>
  )
}

export async function getStaticProps(context) {
  const eventData = null //await fetchTrafficEventData(context)
  const weatherData = await fetchWeatherData(context)
  const publicTransportData = null //await fetchPublicTransportData(context)
  
  return {
    props: {
      eventData,
      weatherData,
      publicTransportData
    },
  }
}
