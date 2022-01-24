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
import { mipFetchWeatherData } from '../../components/weather/MIPWeatherAPI'
import { mipFetchMobilityNewsArticle } from '../../components/news/MIPMobilityNewsAPI'

export default function MobilityDetails({ news, weatherData }) {
  const { t } = useTranslation("common")
  const article = news?.article
  const title = t("MobilityNewsTitle")
  const newsTitle = article?.title ?? t("ArticleNotFound")
  const content = article?.description ?? t("ArticleNotFound")
  const others = news?.others
  return (
    <MIPPage.Page className="mip-article-page"
      pageTitle={title}
      title={title}
      titleClassName="mip-bg-blue"
      breadcrumb={t("GoBack")}>
      <header className="article-title">
        <h2>{newsTitle}</h2>
        <div>
          <span className="mip-tag mip-bg-blue">{article?.type}</span>
          {/* <span className="mip-share-cta">Condividi articolo</span> */}
        </div>
      </header>
      <article className="article-body">
        <p><b>{article.validitystart + (article.validityend ? ` - ${article.validityend}` : '')}</b></p>
        <div dangerouslySetInnerHTML={{ __html: content }}></div>
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
  const news = mipFetchMobilityNewsArticle(context.locale, context.query?.id, 4)
  const pageData = await Promise.all([
    weatherData,
    news,
  ]).then(values => (
    values[1]?.article ? {
      props: {
        weatherData: values[0],
        news: values[1],
      }
    } : { notFound: true }
  ))
  return pageData
}
