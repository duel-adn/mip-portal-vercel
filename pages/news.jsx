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
import MIPPager from '../components/forms/MIPPager'
import MIPWeatherPanel from '../components/weather/MIPWeatherPanel'
import { mipFetchWeatherData } from '../components/weather/MIPWeatherAPI'

export default function News(props) {
  return (
    <MIPPage.Page className="mip-flex-row" title="News" 
      pageTitle="News"
      titleClassName="mip-bg-gray"
      breadcrumb="Indietro" >
      <MIPNewsCardGrid className="mip-3col-page" />
      <MIPPager />
      <MIPWeatherPanel className="mip-my-2" weatherData={props.weatherData}/>
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
