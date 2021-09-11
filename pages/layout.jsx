import MIPPageFooter from '../components/footer/MIPPageFooter'
import MIPNavbar from '../components/header/MIPNavbar'
import MipToolbar from '../components/header/MIPToolbar'
import MIPPageHead from '../components/page/MIPPageHead'
import MIPPathDataForm from '../components/path/MIPPathDataForm'

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
        </header>
        <main className="mip-page-section mip-bg-light">
            <div className="mip-page-row">
            <div>Pariatur aliquam eos maiores corrupti itaque, molestias, recusandae ea deleniti facere facilis magni voluptate dolor qui perspiciatis architecto ducimus dicta in error non quae ab. Id, dolores ducimus! Minus, odio?</div>
            <div>Sed dolorem, cumque maxime odit tempore et cupiditate non esse aliquid reprehenderit sapiente recusandae iste culpa minus optio, cum repudiandae adipisci minima rerum. Harum blanditiis unde dicta quis perferendis quam.</div>
            </div>
            
            <MIPPathDataForm />
        </main>
        <footer className="mip-page-footer mip-bg-blue">
            <MIPPageFooter className="mip-page-row"/>
        </footer>
  </>
  )
}
