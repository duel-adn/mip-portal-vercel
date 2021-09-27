/**
    (C) Duel srl 2021.

    Home page.

    Revision history

    | Data       | Autore | Descrizione 
    | ---------- | ------ | ----------------------------------- |
    | 2021/08/10 | Duel   | Prima versione                      |
*/

import MIPPage from '../components/page/MIPPage'
import MIP404Panel from '../components/page/MIP404Panel'

export default function Tpl(props) {
  return (
    <MIPPage
      breadcrumb='Indietro'>
        <MIP404Panel />
    </MIPPage>
  )
}
