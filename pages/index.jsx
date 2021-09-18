/**
    (C) Duel srl 2021.

    Home page.

    Revision history

    | Data       | Autore | Descrizione 
    | ---------- | ------ | ----------------------------------- |
    | 2021/08/10 | Duel   | Prima versione                      |
*/

import MIPPageHead from '../components/page/MIPPageHead'
import MIPPageHeader from '../components/header/MIPPageHeader'
import MIPPageFooter from '../components/footer/MIPPageFooter'
import { MIPRealTimeBanner } from '../components/page/MIPPageBanner'
import MIPPathDataPanel from '../components/path/MIPPathDataPanel'
import MIPTrafficPanel from '../components/traffic/MIPTrafficPanel'
import MIPPublicTransportPanel, {fetchPublicTransportData} from '../components/news/MIPPublicTransportPanel'
import MIPMobilityNewsPanel from '../components/news/MIPMobilityNewsPanel'
import MIPServicePanel from '../components/services/MIPServicePanel'
import MIPWeatherPanel, {fetchWeatherData} from '../components/wheather/MIPWeatherPanel'
import { fetchTrafficEventData } from '../components/traffic/MIPTrafficEventList'

export default function Home(props) {
  return (
    <>
      <MIPPageHead title="Muoversi in Piemonte" />
      <MIPPageHeader className="mip-page-header"/>
      <header className="mip-page-header">
        <MIPRealTimeBanner className="mip-page-row"
          title="Allerta meteo Cuneo:
              ANAS al lavoro per rimozione neve."
          tag="Ultim'ora" image="/images/home-hero.png" />
      </header>
      <main className="mip-bg-light mip-page-main">
        <section className="mip-page-flex-row">
          <aside className="mip-path-data-panel">
            <MIPPathDataPanel className="mip-rounded-corners" title="Ricerca percorso" />
          </aside>
          <MIPTrafficPanel className="mip-traffic-panel" eventData={props.eventData}/>
        </section>
        <section className="mip-page-flex-row">
          <MIPPublicTransportPanel className="mip-information-panel" title="Avvisi di trasporto pubblico locale" publicTransportData={props.publicTransportData}/>
          <MIPMobilityNewsPanel className="mip-information-panel" title="Avvisi mobilità" publicTransportData={props.publicTransportData}/>
          <MIPServicePanel className="mip-service-panel"/>
        </section>
      </main>
      <aside className="mip-page-section mip-weather-panel">
        <MIPWeatherPanel className="mip-page-row" weatherData={props.weatherData}/>
      </aside>
      <footer className="mip-page-footer mip-bg-blue">
        <MIPPageFooter className="mip-page-row" />
      </footer>
    </>
  )
}

export async function getStaticProps(context) {
  const eventData = await fetchTrafficEventData(context)
  const weatherData = await fetchWeatherData(context)
  const publicTransportData = await fetchPublicTransportData(context)
  
  return {
    props: {
      eventData,
      weatherData,
      publicTransportData
    },
  }
}
