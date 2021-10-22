/**
    (C) Duel srl 2021.

    Pagina di test del layout.

    Revision history

    | Data       | Autore | Descrizione 
    | ---------- | ------ | ----------------------------------- |
    | 2021/08/10 | Duel   | Prima versione                      |
*/
import MIPPage from '../components/page/MIPPage'
import MIPPath from '../components/path/MIPPath'

export default function Layout({ eventData }) {
  return (
    <MIPPage className="mip-home-page1"
      pageTitle="Layout test">
        <MIPPath.Controller className="mip-rounded-corners" responsive title="Calcola il percorso"/>
    </MIPPage>
  )
}
