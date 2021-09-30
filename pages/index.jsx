/**
  Duel S.p.A.

  Home page portale

  Revision history

  | Data       | Autore | Descrizione 
  | ---------- | ------ | ----------------------------------- |
  | 2021/08/10 | Duel   | Prima versione                      |
*/
import MIPPage from '../components/page/MIPPage'
import { MIPRealTimeBanner } from '../components/page/MIPPageBanner'
import MIPPathDataPanel from '../components/path/MIPPathDataPanel'
import MIPTrafficEventPanel from '../components/traffic/MIPTrafficEventPanel'
import MIPPublicTransportPanel, { fetchPublicTransportData } from '../components/news/MIPPublicTransportPanel'
import MIPTrafficMapPanel from '../components/traffic/MIPTrafficMapPanel'
import MIPMobilityNewsPanel from '../components/news/MIPMobilityNewsPanel'
import MIPServicePanel from '../components/services/MIPServicePanel'
import MIPWeatherPanel, { fetchWeatherData } from '../components/weather/MIPWeatherPanel'
import { mipFetchTrafficEventData } from '../components/traffic/MIPTrafficAPI'
import { fetchMobilityNewsData } from '../components/news/MIPMobilityNewsPanel'

export default function Home(props) {
  return (
      <MIPPage className="mip-home-page"
        pageTitle="Muoversi in Piemonte">
          <MIPRealTimeBanner className="banner"
              title="Allerta meteo Cuneo:
                  ANAS al lavoro per rimozione neve."
              tag="Ultim'ora" image="/images/home-hero.jpg" />
          <MIPPathDataPanel className="mip-rounded-corners" title="Percorso"/>
          <MIPTrafficEventPanel className="event-panel"
              trafficEventData={props.trafficEventData} compact={true} />
          <MIPTrafficMapPanel className="map-panel" 
              trafficEventData={props.trafficEventData}/>
          <MIPPublicTransportPanel className="tpl-panel"
              title="Avvisi di trasporto pubblico locale" 
              publicTransportData={props.publicTransportData} />
            <MIPMobilityNewsPanel className="news-panel"
              title="Avvisi mobilità" newsData={props.newsData} />
            <MIPServicePanel className="service-panel" />
            <MIPWeatherPanel 
              className="weather-panel"
              weatherData={props.weatherData} />
      </MIPPage>
  )
}

export async function getStaticProps(context) {
  const trafficEventData = await mioFetchTrafficEventData(context)
  const weatherData = await fetchWeatherData(context)
  const publicTransportData = await fetchPublicTransportData(context)
  const newsData = await fetchMobilityNewsData(context)
  
  return {
    props: {
      trafficEventData,
      weatherData,
      publicTransportData,
      newsData
    },
  }
}
