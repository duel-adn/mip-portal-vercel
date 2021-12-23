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
import { mipFetchWeatherData } from '../components/weather/MIPWeatherAPI'

const newsList = [
  {
      thumbnail: '/news-images/news-thumb-3.png',
      thumbnail_alt: 'montagna innevata',
      type: 'news',
      date: '15 settembre 2021',
      title: 'Aperta la stagione sciistica sulle più belle vette del Piemonte',
      description: 'L\'edizione 104 della corsa rosa prenderà il via l\'8 maggio dal capoluogo piemontese con (...)'
  },
  {
      thumbnail: '/news-images/news-thumb-1.png',
      thumbnail_alt: 'foto aerea della A1',
      type: 'news',
      date: '13 settembre 2021',
      title: 'Tir, perdita carico in autostrada A1',
      description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Minus consectetur nihil fuga ipsa autem soluta, corporis, eligendi facilis eum quis quam. '
  },
  {
      thumbnail: '/news-images/news-thumb-2.png',
      thumbnail_alt: 'pendolari in attesa',
      type: 'news',
      date: '10 settembre 2021',
      title: 'Capienza al 60% su i mezzi pubblici del capoluogo',
      description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Minus consectetur nihil fuga ipsa autem soluta, corporis, eligendi facilis eum quis quam. '
  },
  {
      thumbnail: '/news-images/news-thumb-4.png',
      thumbnail_alt: 'arrivo giro d\'italia',
      type: 'news',
      date: '15 giugno 2021',
      title: 'Torino ospita la partenza del Giro d’Italia 2021',
      description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Minus consectetur nihil fuga ipsa autem soluta, corporis, eligendi facilis eum quis quam. '
  },
  {
      thumbnail: '/news-images/news-thumb-2.png',
      thumbnail_alt: 'pendolari in attesa',
      type: 'news',
      date: '30 settembre 2021',
      title: 'Capienza al 60% su i mezzi pubblici del capoluogo',
      description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Minus consectetur nihil fuga ipsa autem soluta, corporis, eligendi facilis eum quis quam. '
  },
  {
      thumbnail: '/news-images/news-thumb-3.png',
      thumbnail_alt: 'montagna innevata',
      type: 'news',
      date: '15 ottobre 2021',
      title: 'Aperta la stagione sciistica sulle più belle vette del Piemonte',
      description: 'L\'edizione 104 della corsa rosa prenderà il via l\'8 maggio dal capoluogo piemontese con (...)'
  },
  {
      thumbnail: '/news-images/news-thumb-1.png',
      thumbnail_alt: 'foto aerea della A1',
      type: 'news',
      date: '13 agosto 2021',
      title: 'Tir, perdita carico in autostrada A1',
      description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Minus consectetur nihil fuga ipsa autem soluta, corporis, eligendi facilis eum quis quam. '
  },
  {
      thumbnail: '/news-images/news-thumb-2.png',
      thumbnail_alt: 'pendolari in attesa',
      type: 'news',
      date: '7 luglio 2021',
      title: 'Capienza al 60% su i mezzi pubblici del capoluogo',
      description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Minus consectetur nihil fuga ipsa autem soluta, corporis, eligendi facilis eum quis quam. '
  },
  {
      thumbnail: '/news-images/news-thumb-2.png',
      thumbnail_alt: 'pendolari in attesa',
      type: 'news',
      date: '8 settembre 2021',
      title: 'Capienza al 60% su i mezzi pubblici del capoluogo',
      description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Minus consectetur nihil fuga ipsa autem soluta, corporis, eligendi facilis eum quis quam. '
  },
  {
      thumbnail: '/news-images/news-thumb-4.png',
      thumbnail_alt: 'arrivo giro d\'italia',
      type: 'news',
      date: '18 settembre 2021',
      title: 'Torino ospita la partenza del Giro d’Italia 2021',
      description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Minus consectetur nihil fuga ipsa autem soluta, corporis, eligendi facilis eum quis quam. '
  },
  {
      thumbnail: '/news-images/news-thumb-2.png',
      thumbnail_alt: 'pendolari in attesa',
      type: 'news',
      date: '28 agosto 2021',
      title: 'Capienza al 60% su i mezzi pubblici del capoluogo',
      description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Minus consectetur nihil fuga ipsa autem soluta, corporis, eligendi facilis eum quis quam. '
  },
  {
      thumbnail: '/news-images/news-thumb-3.png',
      thumbnail_alt: 'montagna innevata',
      date: '28 febbraio 2021',
      type: 'news',
      title: 'Aperta la stagione sciistica sulle più belle vette del Piemonte',
      description: 'L\'edizione 104 della corsa rosa prenderà il via l\'8 maggio dal capoluogo piemontese con (...)'
  },
]

export default function MobilityNews(props) {
  return (
      <MIPPage.Page className="mip-flex-row" 
      pageTitle="Mobilità alternativa"
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
          <MIPNewsCardGrid className="mip-3col-page" articles={newsList.slice(0,6)} maxNews={6} simple/>
        </section>
        <aside className="mip-mt-auto mip-mb-2">
          <MIPWeatherPanel 
            weatherData={props.weatherData} />
      </aside>
      </MIPPage.Page>
  )
}

export async function getServerSideProps(context) {
  const weatherData = await mipFetchWeatherData(context)
  
  return {
    props: {
      weatherData,
    },
  }
}
