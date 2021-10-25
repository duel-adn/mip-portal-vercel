/**
  Duel S.p.A.

  Home page portale

  Revision history

  | Data       | Autore | Descrizione 
  | ---------- | ------ | ----------------------------------- |
  | 2021/08/10 | Duel   | Prima versione                      |
*/
import MIPPage from '../components/page/MIPPage'
import MIPBanner from '../components/page/MIPBanner'
import MIPPath from '../components/path/MIPPath'
import MIPTrafficEventPanel from '../components/traffic/MIPTrafficEventPanel'
import MIPPublicTransportPanel from '../components/news/MIPPublicTransportPanel'
import MIPTrafficMapPanel from '../components/traffic/MIPTrafficMapPanel'
import MIPMobilityNewsPanel from '../components/news/MIPMobilityNewsPanel'
import MIPServicePanel from '../components/services/MIPServicePanel'
import MIPWeatherPanel from '../components/weather/MIPWeatherPanel'
import { mipFetchWeatherData } from '../components/weather/MIPWeatherAPI'
import { mipFetchTrafficEventData } from '../components/traffic/MIPTrafficAPI'
import { mipFetchPublicTransportData } from '../components/tpl/MIPTPLAPI'
import { mipFetchMobilityNewsData } from '../components/news/MIPMobilityNewsAPI'

export default function Home(props) {
  return (
      <MIPPage.Page className="mip-home-page"
        pageTitle="Muoversi in Piemonte">
          <MIPBanner.RTBanner className="banner"
              title="Allerta meteo Cuneo:
                  ANAS al lavoro per rimozione neve."
              tagTitle="Ultim'ora" height="300px" imageUrl="/images/home-hero.jpg" />
          <MIPPath.Controller className="mip-rounded-corners" title="Calcola il percorso" />
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
      </MIPPage.Page>
  )
}

export async function getServerSideProps(context) {
  const trafficEventData = await mipFetchTrafficEventData(context)
  const weatherData = await mipFetchWeatherData(context)
  const publicTransportData = await mipFetchPublicTransportData(context)
  const newsData = await mipFetchMobilityNewsData(context)
  
  return {
    props: {
      trafficEventData,
      weatherData,
      publicTransportData,
      newsData
    },
  }
}
