import MIPPageFooter from '../components/footer/MIPPageFooter'
import MIPNavbar from '../components/header/MIPNavbar'
import MipToolbar from '../components/header/MIPToolbar'
import MIPPageHead from '../components/page/MIPPageHead'
import MIPPathDataPanel from '../components/path/MIPPathDataPanel'
import MIPServicePanel from '../components/services/MIPServicePanel'
import MIPWeatherPanel, {fetchWeatherData} from '../components/wheather/MIPWeatherPanel'
import { MIPRealTimeBanner } from '../components/page/MIPPageBanner'
import MIPTrafficEventPanel from '../components/traffic/MIPTrafficEventPanel';
import { fetchTrafficEventData } from '../components/traffic/MIPTrafficEventList';

export default function TypographyTest(props) {
  return (
    <>
    <MIPPageHead title="Layout test"/>
    <header className="mip-page-section">
        <div className="mip-bg-dark">
            <MipToolbar className="mip-page-row"/>
        </div>
        <div className="mip-bg-light">
            <MIPNavbar className="mip-page-row" />
        </div>
        <MIPRealTimeBanner className="mip-page-row" 
            title="Allerta meteo Cuneo:
            ANAS al lavoro per rimozione neve." 
            tag="Ultim'ora" image="/images/home-hero.png"/>
    </header>
    <main className="mip-page-section mip-bg-light">
        <div className="mip-page-row">
            <div>Pariatur aliquam eos maiores corrupti itaque, molestias, recusandae ea deleniti facere facilis magni voluptate dolor qui perspiciatis architecto ducimus dicta in error non quae ab. Id, dolores ducimus! Minus, odio?</div>
            <div>Sed dolorem, cumque maxime odit tempore et cupiditate non esse aliquid reprehenderit sapiente recusandae iste culpa minus optio, cum repudiandae adipisci minima rerum. Harum blanditiis unde dicta quis perferendis quam.</div>
        </div>
        <div className="mip-page-flex-row">
            <MIPPathDataPanel className="mip-rounded-corners" title="Ricerca percorso" />
            <MIPTrafficEventPanel className="mip-rounded-corners" eventData={props.eventData}/>
            
        </div>
    </main>
    <section className="mip-page-section">
    <MIPServicePanel />
    </section>
    <section className="mip-page-section">
        <MIPWeatherPanel className="mip-page-row" weatherData={props.weatherData}/>
    </section>
    <footer className="mip-page-footer mip-bg-blue">
        <MIPPageFooter className="mip-page-row"/>
    </footer>
  </>
  )
}

export async function getStaticProps(context) {
    const eventData = await fetchTrafficEventData(context)
    const weatherData = await fetchWeatherData(context)
    const publicTransportData = null; //await fetchPublicTransportNews(context)
    
    return {
      props: {
        eventData,
        weatherData,
        publicTransportData
      },
    }
  }
  