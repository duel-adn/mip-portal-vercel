/**
    (C) Duel srl 2021.

    Pagina delle news.

    Revision history

    | Data       | Autore | Descrizione 
    | ---------- | ------ | ----------------------------------- |
    | 2021/08/10 | Duel   | Prima versione                      |
*/

import useTranslation from 'next-translate/useTranslation'

import MIPPage from '../../components/page/MIPPage'
import MIPNewsCardGrid from '../../components/news/MIPNewsCardGrid'
import MIPWeatherPanel from '../../components/weather/MIPWeatherPanel'
import MIPBanner from '../../components/page/MIPBanner'
import { mipFetchWeatherData } from '../../components/weather/MIPWeatherAPI'
import { mipFetchPublicTransportArticle } from '../../components/tpl/MIPTPLAPI'

export default function Home({publicTransportData, weatherData}) {
  const { t } = useTranslation("common")
  const article = publicTransportData?.article
  const title = article?.title ?? "Non trovata"
  const content = article?.description ?? "Articolo non trovato"
  const others = publicTransportData?.others
  return (
    <MIPPage.Page className="mip-article-page"
      pageTitle="Giro d'Italia"
      breadcrumb={t("GoBack")}>
      {/* <MIPBanner.Banner className="banner"
        height="300px" imageUrl="/news-images/article-full.jpg" /> */}
      <header className="article-title">
        <h2>{title}</h2>
        <div>
          <span className="mip-tag mip-bg-dark-blue">{article?.type}</span>
          {/* <span className="mip-share-cta">Condividi articolo</span> */}
        </div>
      </header>
      <article className="article-body">
      <p><b>{article.validitystart + (article.validityend ? ` - ${article.validityend}` : '')}</b></p>
      <div dangerouslySetInnerHTML={{__html: content}}></div>
      </article>
      <section className="page-aside">
          <MIPNewsCardGrid className="mip-page-flex-row-" simple articles={others} />
      </section>
      <aside className="weather-panel">
        <MIPWeatherPanel weatherData={weatherData} />
      </aside>
    </MIPPage.Page>
  )
}

export async function getServerSideProps(context) {
  const weatherData = mipFetchWeatherData(context)
  const publicTransportData = mipFetchPublicTransportArticle(context.locale, context.query?.id, 4)
  const pageData = await Promise.all([
    weatherData,
    publicTransportData,
  ]).then(values => ({
    props: {
      weatherData: values[0],
      publicTransportData: values[1],
    }
  }))
  return pageData
}
