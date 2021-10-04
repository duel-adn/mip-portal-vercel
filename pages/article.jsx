/**
    (C) Duel srl 2021.

    Pagina delle news.

    Revision history

    | Data       | Autore | Descrizione 
    | ---------- | ------ | ----------------------------------- |
    | 2021/08/10 | Duel   | Prima versione                      |
*/

import MIPPage from '../components/page/MIPPage'
import MIPNewsCardGrid from '../components/news/MIPNewsCardGrid'
import MIPWeatherPanel from '../components/weather/MIPWeatherPanel'
import { MIPPageBanner } from '../components/page/MIPPageBanner'
import { mipFetchTrafficEventData } from '../components/traffic/MIPTrafficAPI'
import { mipFetchWeatherData } from '../components/weather/MIPWeatherAPI'

export default function Home(props) {
  return (
      <MIPPage className="mip-article-page" 
      pageTitle="Giro d'Italia"
      breadcrumb='Indietro'>
      <MIPPageBanner className="banner"
          image="/news-images/article-full.jpg" />
      <header className="article-title">
      <h2>Giro d’Italia. 8 Maggio  Torino ospita la prima tappa.
Alcune modifiche viabili nella zona est della città.</h2>
        <div>
          <span className="mip-tag mip-bg-light-blue">news</span>
          <span className="mip-share-cta">Condividi articolo</span>
        </div>
      </header>
      <article className="article-body">
        <p>La manifestazione sportiva si svolgerà interamente all&apos;interno del territorio comunale, con una “cronometro individuale”, e interesserà gran parte della zona centro e la zona est della città (precollina), comprese entrambe le aree limitrofe le sponde del fiume Po, da Ponte Regina Margherita fino al Ponte Balbis.</p>

<p>La partenza della tappa sarà in piazza Castello, mentre l’arrivo è posizionato a ridosso di piazza Gran Madre di Dio, in Corso Moncalieri angolo via Gioannetti.
L’intera area sarà soggetta a modifiche viabili e divieti di sosta.</p>

<p><b>Il circuito si snoderà lungo le seguenti vie:</b></p>
<p>PARTENZA piazza Castello, fronte Regione – piazza Castello, fronte via Roma – piazza Castello carreggiata nord contromano – piazza Castello fornici Prefettura – viale I Maggio – viale Partigiani – corso San Maurizio, carreggiata centrale – lungo Po Cadorna – lungo Po Diaz – corso Cairoli – Arco Monumentale dell’Artiglieria - viale Virgilio – viale Turr – viale Marinai d’Italia - via Tiepolo (salita verso Galileo Galilei) – corso Galileo Galilei (direzione nord) – rotonda Dante – ponte Isabella – corso Moncalieri (direzione sud) – corso Sicilia – piazza Zara (varco benzinaio) corso Moncalieri (direzione nord) – corso Moncalieri (ang. Gioannetti) ARRIVO.</p>

<p>Lungo tutto il percorso di gara e in alcune zone limitrofe sarà in vigore il divieto di sosta permanente e continuo, dalle ore 20.00 del giorno 7 maggio fino al termine della manifestazione.</p>

Dalle ore 8.00 dell’8 maggio e fino all’ultimazione della gara, indicativamente intorno alle 20.00, per attraversare la città in direzione SUD provenendo da Corso Casale si dovrà aggirare l’area “Rossa” utilizzando Ponte Regina Margherita e Corso Regina Margherita, mentre in direzione NORD provenendo da Corso Moncalieri si dovrà aggirare l’area utilizzando corso Monterotondo, Ponte Balbis e corso Bramante.

<p><b>Per raggiungere il centro città e la parte OVEST, scendendo dalla collina, si dovrà aggirare la zona di gara, utilizzando i ponti Balbis e Regina Margherita.</b></p>

<p>Anche i percorsi dei mezzi di trasporto pubblico transitanti nell’area interessata dalla manifestazione subiranno delle deviazioni. Sabato 8 maggio saranno deviate le linee 6 – 13 – 15 – 16CS – 16CD – 18 – 30 – 42 – 52 – 53 – 55 – 56 – 61 – 66 – 68 – 70 – 73.</p>

<p>La linea 73 subirà una variazione di percorso già dal 2 maggio e per tutta la settimana.</p>

<p>Info: 011011011</p>
<a href="https://www.comune.torino.it">www.comune.torino.it</a>
<a href="https://www.comune.torino.it/vigiliurbani/">www.comune.torino.it/vigiliurbani/</a>
        </article>
      <section className="page-aside">
        <MIPNewsCardGrid className="mip-page-flex-row-" maxNews={6} simple/>
      </section>
      <aside className="weather-panel">
        <MIPWeatherPanel weatherData={props.weatherData}/>
      </aside>
    </MIPPage>
  )
}

export async function getServerSideProps(context) {
  const eventData = await mipFetchTrafficEventData(context)
  const weatherData = await mipFetchWeatherData(context)
  
  return {
    props: {
      eventData,
      weatherData,
    },
  }
}
