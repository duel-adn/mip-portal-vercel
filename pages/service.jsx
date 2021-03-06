/**
    (C) Duel srl 2021.

    Pagina delle news.

    Revision history

    | Data       | Autore | Descrizione 
    | ---------- | ------ | ----------------------------------- |
    | 2021/08/10 | Duel   | Prima versione                      |
*/

import Link from 'next/link'
import useTranslation from 'next-translate/useTranslation'
import MIPPage from '../components/page/MIPPage'

export default function Service(props) {
  const { t } = useTranslation("common")
  return (
      <MIPPage.Page className="mip-flex-row" 
      pageTitle="Il servizio Muoversi in Piemonte"
      title="Il servizio Muoversi in Piemonte" 
        titleClassName="mip-bg-blue"
        breadcrumb={t("GoBack")}>
        <article className="mip-mb-2 mip-temp-page">
        <p><Link href="/"><a>Muoversi in Piemonte</a></Link> è il servizio unico di infomobilità che offre informazioni utili e aggiornate per pianificare i tuoi spostamenti sul
territorio regionale.</p>

<p>Il servizio include:</p>
<p/>
<ul>
  <li className="mip-mb-2 square">aggiornamenti costanti e in tempo reale sui principali eventi che possono condizionare il traffico sulle strade regionali: interruzioni stradali, eventi atmosferici, code, incidenti ed emergenze. Le informazioni sul traffico sono diffuse attraverso 4 canali:</li>
  <ul>
    <li>10 bollettini radiofonici, diffusi su <Link href="/radio"><a>emittenti radiofoniche</a></Link> a copertura locale e regionale, messi a disposizione dalla Centrale del Traffico Regionale nei seguenti orari:</li>
    <li className="none">dal lunedì al venerdì: 7.40 – 8.10 – 9.10 – 10.10 – 13.10 – 16.10 – 17.10 – 18.10 – 19.10 – 20.10</li>
    <li className="none">il sabato, domenica e festivi: 8.10 – 9.10 – 10.10 – 13.10 – 16.10 – 17.10 – 18.10 – 19.10 – 20.10 – 21.10</li>
    <li>il portale <Link href="/"><a>www.muoversinpiemonte.it</a></Link> aggiornato tutti i giorni dalle 7.00 alle 21.30</li>
    <li>il Numero Verde Unico della Regione Piemonte <b>800 333 444</b> attivo dal lunedì al venerdì dalle ore 8 alle 18 con orario continuato, festivi esclusi, gratuito da telefono fisso e mobile.</li>
    <li>l&apos;account Twitter <a href="https://twitter.com/MIPiemonte" target="_blank" rel="noopener noreferrer">@MIPiemonte</a></li>
  </ul>
  <li className="mip-mt-2 square">
  un servizio di calcolo percorso che permette di ricercare e pianificare gli spostamenti sul territorio regionale utilizzando i servizi di trasporto pubblico in tutte le sue declinazioni (bus e tram urbani, servizi extraurbani e treno) o tramite percorsi pedonali o con l’utilizzo dell’auto personale. 
  Il servizio utilizza tecnologie open source, largamente diffuse e consolidate come <a href="http://www.openstreetmap.org/" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> e <a href="http://www.opentripplanner.org/" target="_blank" rel="noopener noreferrer">OpenTripPlanner</a>, e 
  si basa sugli <Link href="/data"><a>orari programmati forniti dagli Enti e dalle aziende piemontesi di trasporto pubblico</a></Link> aderenti al sistema 
  BIP <a href="http://bip.piemonte.it/" target="_blank" rel="noopener noreferrer">(Biglietto Integrato Piemonte)</a>.
  </li>
</ul>
<p className="mip-my-2"><Link href="/"><a>Muoversi in Piemonte</a></Link> è un servizio promosso da <a href="https://www.regione.piemonte.it/web/temi/mobilita-trasporti" target="_blank" rel="noopener noreferrer">Regione Piemonte</a> in collaborazione con <a href="http://www.5t.torino.it/" target="_blank" rel="noopener noreferrer">5T.</a></p>
        </article>
      </MIPPage.Page>
  )
}
