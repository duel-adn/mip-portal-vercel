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
import MIPWeatherPanel, {fetchWeatherData} from '../components/wheather/MIPWeatherPanel'
import { fetchTrafficEventData } from '../components/traffic/MIPTrafficEventList'
import { MIPPageBanner } from '../components/page/MIPPageBanner'

export default function Home(props) {
  return (
    <>
      <MIPPageHead title="Mobilità alternativa" />
      <MIPPageHeader className="mip-page-header" breadcrumb='Indietro'/>
      <header className="mip-page-header">
        <MIPPageBanner className="mip-page-row"
          image="/news-images/mobility-full.png" />
      </header>
      <main className="mip-bg-light mip-page-main">
        <div className="mip-page-row">
        <article className="mip-article-body">
        <h2>Giro d’Italia. 8 Maggio  Torino ospita la prima tappa.
Alcune modifiche viabili nella zona est della città.</h2>
        <div>
          <span className="mip-tag mip-bg-light-blue">news</span>
          <span className="mip-share-cta">Condividi articolo</span>
        </div>
        <p><b>Lorem ipsum dolor sit amet</b></p>
        <p>Lorem ipsum dolor sit amet. Ad doloribus commodi et repellat At doloribus expedita. Et debitis veniam sit magni veritatis et aperiam quae eum cumque unde qui magni vero ea enim tempora ut ullam fugiat.</p>
        <p><b>Lorem ipsum dolor sit amet</b></p>
        <p>Lorem ipsum dolor sit amet. Ad doloribus commodi et repellat At doloribus expedita. Et debitis veniam sit magni veritatis et aperiam quae eum cumque unde qui magni vero ea enim tempora ut ullam fugiat.</p>
        </article>
        <section className="mip-page-row">
        <MIPNewsCardGrid className="mip-page-flex-aside" maxNews={6} simple/>
        </section>
        </div>
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
