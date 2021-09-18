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
import MIPNewsCardGrid from '../components/news/MIPNewsCardGrid'
import MIPPager from '../components/forms/MIPPager'
import MIPWeatherPanel, {fetchWeatherData} from '../components/wheather/MIPWeatherPanel'
import { fetchTrafficEventData } from '../components/traffic/MIPTrafficEventList'

export default function Home(props) {
  return (
    <>
      <MIPPageHead title="News" />
      <MIPPageHeader className="mip-page-header" title="Articoli su: News" titleClassName="mip-bd-gray"/>
      <main className="mip-bg-light mip-page-main">
        <section className="mip-page-flex-row-">
        <MIPNewsCardGrid className="mip-page-flex-row" />
        </section>
        <nav className="mip-page-flex-row">
          <MIPPager />
        </nav>
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
  const publicTransportData = null; //await fetchPublicTransportData(context)
  
  return {
    props: {
      eventData,
      weatherData,
      publicTransportData
    },
  }
}
