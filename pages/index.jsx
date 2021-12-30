/**
  Duel S.p.A.

  Home page portale

  Revision history

  | Data       | Autore | Descrizione 
  | ---------- | ------ | ----------------------------------- |
  | 2021/08/10 | Duel   | Prima versione                      |
*/

import useTranslation from 'next-translate/useTranslation'

import MIPPage from '../components/page/MIPPage'
import MIPBanner from '../components/page/MIPBanner'
import MIPPath from '../components/path/MIPPath'
import MIPPublicTransportPanel from '../components/news/MIPPublicTransportPanel'
import MIPTrafficMapPanel from '../components/traffic/MIPTrafficMapPanel'
import MIPMobilityNewsPanel from '../components/news/MIPMobilityNewsPanel'
import MIPServicePanel from '../components/services/MIPServicePanel'
import MIPWeatherPanel from '../components/weather/MIPWeatherPanel'
import { mipFetchWeatherData } from '../components/weather/MIPWeatherAPI'
import { mipFetchTrafficEventData } from '../components/traffic/MIPTrafficAPI'
import { mipFetchPublicTransportData } from '../components/tpl/MIPTPLAPI'
import { mipFetchMobilityNewsData } from '../components/news/MIPMobilityNewsAPI'
import MIPTraffic from '../components/traffic/MIPTraffic'

export default function Home(props) {
  const { t } = useTranslation("common")
  const { tt } = useTranslation("traffic")
  return (
    <MIPPage.Page className="mip-home-page"
      pageTitle="Muoversi in Piemonte">
      {/* <MIPBanner.RTBanner className="banner"
        title="Allerta meteo Cuneo:
                  ANAS al lavoro per rimozione neve."
        tagTitle="Ultim'ora" height="300px" imageUrl="/images/home-hero.jpg" /> */}
      <MIPPath.Controller url="/planner">
        <MIPPath.DataForm className="mip-rounded-corners path-panel"
          title={t("PlannerTitle")} responsive />
      </MIPPath.Controller>
      <MIPTraffic.Controller eventData={props.trafficEventData}>
        <MIPTraffic.Panel className="event-panel mip-tl-rounded-corners" headerClass="mip-bg-accent"
          title={t("RealTimeShort")}
          subtitle={t("DiscoverRealTime")} compact={true} />
        <MIPTrafficMapPanel className="map-panel"
          trafficEventData={props.trafficEventData} />
      </MIPTraffic.Controller>
      <MIPPublicTransportPanel className="tpl-panel"
        title={t("PTNewsTitle")}
        publicTransportData={props.publicTransportData} />
      <MIPMobilityNewsPanel className="news-panel"
        title={t("MobilityNewsTitle")} newsData={props.newsData} />
      <MIPServicePanel className="service-panel" />
      <MIPWeatherPanel
        className="weather-panel"
        weatherData={props.weatherData} />
    </MIPPage.Page>
  )
}

export async function getServerSideProps(context) {
  const trafficEventData = mipFetchTrafficEventData(context)
  const weatherData = mipFetchWeatherData(context)
  const publicTransportData = mipFetchPublicTransportData(context)
  const newsData = mipFetchMobilityNewsData(context)
  return Promise.all([
    trafficEventData,
    weatherData,
    publicTransportData,
    newsData
  ]).then(values => ({
    props: {
      trafficEventData: values[0],
      weatherData: values[1],
      publicTransportData: values[2],
      newsData: values[3]
    }
  }))
}
