/**
    Duel S.p.A.

    Home page portale

    Revision history

    | Data       | Autore | Descrizione 
    | ---------- | ------ | ----------------------------------- |
    | 2021/08/10 | Duel   | Prima versione                      |
*/

import MIPPage from '../components/page/MIPPage';
import MIPPathDataPanel from '../components/path/MIPPathDataPanel'
import MIPTrafficPanel from '../components/traffic/MIPTrafficPanel'
import MIPPublicTransportPanel, { fetchPublicTransportData } from '../components/news/MIPPublicTransportPanel'
import MIPMobilityNewsPanel from '../components/news/MIPMobilityNewsPanel'
import MIPServicePanel from '../components/services/MIPServicePanel'
import MIPWeatherPanel, { fetchWeatherData } from '../components/weather/MIPWeatherPanel'
import { MIPRealTimeBanner } from '../components/page/MIPPageBanner'
import { fetchTrafficEventData } from '../components/traffic/MIPTrafficEventList'
import { fetchMobilityNewsData } from '../components/news/MIPMobilityNewsPanel'

export default function Home(props) {
  return (
    <MIPPage className="mip-home-page">
      <MIPRealTimeBanner className="banner"
        title="Allerta meteo Cuneo:
            ANAS al lavoro per rimozione neve."
        tag="Ultim'ora" image="/images/home-hero.jpg" />
      <MIPPathDataPanel className="mip-rounded-corners path" title="Ricerca percorso" />
      <MIPTrafficPanel className="traff mip-wh-100" eventData={props.eventData} compact={true} />
      <MIPPublicTransportPanel className="tpl mip-wh-100" title="Avvisi di trasporto pubblico locale" publicTransportData={props.publicTransportData} />
      <MIPMobilityNewsPanel className="mob mip-wh-100" title="Avvisi mobilità" newsData={props.newsData} />
      <MIPServicePanel className="colli" />
      <MIPWeatherPanel className="meteo mip-mb-4" weatherData={props.weatherData} />
    </MIPPage>
  )
}

export async function getStaticProps(context) {
  const eventData = await fetchTrafficEventData(context)
  const weatherData = await fetchWeatherData(context)
  const publicTransportData = await fetchPublicTransportData(context)
  const newsData = await fetchMobilityNewsData(context)

  return {
    props: {
      eventData,
      weatherData,
      publicTransportData,
      newsData
    },
  }
}
