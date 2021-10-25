/**
    (C) Duel srl 2021.

    Pagina delle news.

    Revision history

    | Data       | Autore | Descrizione 
    | ---------- | ------ | ----------------------------------- |
    | 2021/08/10 | Duel   | Prima versione                      |
*/

import Link from 'next/link'
import MIPPage from '../components/page/MIPPage'

export default function MobilityNews(props) {
  return (
      <MIPPage.Page className="mip-flex-row" 
      pageTitle="Contatti"
      title="Contatti" 
        titleClassName="mip-bg-blue"
        breadcrumb='Indietro'>
        <article className="mip-mb-2 mip-temp-page">
<p>Per segnalazioni e suggerimenti</p>
<ul>
  <li><a href="mailto:muoversinpiemonte@5t.torino.it" target="_blank" rel="noopener noreferrer">mailto:muoversinpiemonte@5t.torino.it</a></li>
  <li><p>contatta il Numero Verde Unico della Regione Piemonte <b>800 333 444</b> attivo dal lunedì al venerdì
dalle ore 8 alle 18 con orario continuato, festivi esclusi, gratuito da telefono fisso e mobile.</p></li>
</ul>
        </article>
      </MIPPage.Page>
  )
}
