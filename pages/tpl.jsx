/**
    (C) Duel srl 2021.

    Pagina delle notizie del trasporto pubblico locale.

    Revision history

    | Data       | Autore | Descrizione 
    | ---------- | ------ | ----------------------------------- |
    | 2021/08/10 | Duel   | Prima versione                      |
*/

import MIPPage from '../components/page/MIPPage'
import MIPTPLServiceList from '../components/tpl/MIPTPLServiceList'

export default function Tpl(props) {
  return (
    <MIPPage.Page
      pageTitle="Trasporto pubblico"
      title="Trasporto pubblico" 
      titleClassName="mip-bg-blue"
      breadcrumb='Indietro'>
        <MIPTPLServiceList />
    </MIPPage.Page>
  )
}
