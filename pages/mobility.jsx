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
import MIPWeatherPanel, {fetchWeatherData} from '../components/weather/MIPWeatherPanel'
import { fetchTrafficEventData } from '../components/traffic/MIPTrafficEventList'

export default function MobilityNews(props) {
  return (
      <MIPPage className="mip-article-page" 
        title="Mobilità alternativa" 
        titleClassName="mip-bg-accent"
        breadcrumb='Indietro'>
        <img src="/news-images/mobility-full.png" width="100%" height="auto" alt="bicicletta"/>
        <article className="mip-mt-2">
          <p><b>Lorem ipsum dolor sit amet</b></p>
          <p>Lorem ipsum dolor sit amet. Ad doloribus commodi et repellat At doloribus expedita. Et debitis veniam sit magni veritatis et aperiam quae eum cumque unde qui magni vero ea enim tempora ut ullam fugiat.</p>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam, porro animi. Quaerat cupiditate, voluptate delectus totam nam magni ullam sed cum, suscipit vel ducimus consectetur impedit eaque enim? Reiciendis, consequuntur!</p>
          <p>Magni asperiores rem hic, tempora ad optio. Itaque ea maxime quis quas fugit earum iste nostrum incidunt aperiam tempora dolores facilis eaque neque minima, consequuntur saepe est similique accusantium sit.</p>
          <p><b>Lorem ipsum dolor sit amet</b></p>
          <p>Lorem ipsum dolor sit amet. Ad doloribus commodi et repellat At doloribus expedita. Et debitis veniam sit magni veritatis et aperiam quae eum cumque unde qui magni vero ea enim tempora ut ullam fugiat.</p>
          <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Repudiandae, nobis modi temporibus quos omnis, blanditiis voluptate doloremque atque similique perspiciatis sit ad sapiente qui aspernatur deleniti non! Amet, voluptatum at.</p>
          <p>Facere id iure, quo mollitia quam eius fuga error esse deserunt eos consequuntur vel rem qui fugit? Ratione, nisi eveniet. Sit fuga perspiciatis eveniet beatae facere iure officia? Dolore, ab.</p>
        </article>
        <section className="mip-mt-auto">
          <h2 className="mip-my-2">Notizie in tempo reale su Mobilità Alternativa</h2>
          <MIPNewsCardGrid maxNews={6} simple/>
        </section>
      </MIPPage>
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
