/**
    (C) Duel srl 2021.

    Pagina traffico su gomma in tempo reale.

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
import MIPWeatherPanel, {fetchWeatherData} from '../components/weather/MIPWeatherPanel'
import { fetchTrafficEventData } from '../components/traffic/MIPTrafficEventList'
import MIPTrafficLegend from '../components/traffic/MIPTrafficLegend'

export default function Home(props) {
  return (
    <>
      <MIPPageHead title="Traffico in tempo reale" />
      <MIPPageHeader className="mip-page-header" 
        title="Traffico in tempo reale"
        titleClassName="mip-bg-accent"/>
      <main className="mip-bg-light mip-page-main">
        <section className="mip-page-flex-row">
          <aside className="mip-path-data-panel">
            <MIPPathDataPanel className="mip-rounded-corners" title="Ricerca percorso" />
          </aside>
          <MIPTrafficPanel className="mip-traffic-panel" eventData={props.eventData}/>
        </section>
        <legend className="mip-page-row">
          <MIPTrafficLegend className="mip-rounded-corners" />
        </legend>
      </main>
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
