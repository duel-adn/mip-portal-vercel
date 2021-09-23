/**
    (C) Duel srl 2021.

    Home page.

    Revision history

    | Data       | Autore | Descrizione 
    | ---------- | ------ | ----------------------------------- |
    | 2021/08/10 | Duel   | Prima versione                      |
*/

import MIPPageHead from '../components/page/MIPPageHead'
import MIPPageHeader from '../components/header/MIPPageHeader'
import MIPPageFooter from '../components/footer/MIPPageFooter'
import MIP404Panel from '../components/page/MIP404Panel'

export default function Page404(props) {
  return (
    <>
      <MIPPageHead title="Muoversi in Piemonte" />
      <MIPPageHeader className="mip-page-header" breadcrumb="Indietro"/>
      <main className="mip-bg-light mip-page-main">
        <MIP404Panel className="mip-page-row"/>
      </main>
      <footer className="mip-page-footer mip-bg-blue">
        <MIPPageFooter className="mip-page-row" />
      </footer>
    </>
  )
}

