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
      <MIPPage className="mip-flex-row" 
      pageTitle="Cookies"
      title="Disclaimer" 
        titleClassName="mip-bg-blue"
        breadcrumb='Indietro'>
        <article className="mip-mb-2 mip-temp-page">
        <h2>Utilizzo dei cookie</h2>
<p>Ai sensi del provvedimento n. 229 del 8 maggio 2014 <b>“Individuazione delle modalità semplificate per l’informativa e l’acquisizione del consenso per l’uso dei cookie”</b> del Garante per la protezione dei dati personali, si informa che il sito <Link href="/"><a>www.muoversinpiemonte.it</a></Link> utilizza cookies al fine di rendere la navigazione del sito sicura ed efficiente e che non consentono l’acquisizione di dati personali identificativi dell’utente. Utilizzando il sito web <Link href="/"><a>www.muoversinpiemonte.it</a></Link>it, l
’utente dichiara di accettare e acconsentire all’utilizzo dei cookies in conformità con i termini di uso dei cookies espressi in questa informativa.</p>

<h3>Che cosa sono i cookie?</h3>
<p>I cookie sono file di testo che contengono pacchetti di informazioni che vengono memorizzati sul tuo computer o sul tuo dispositivo mobile tutte le volte che visiti un sito online attraverso un browser. Ad ogni successiva visita il browser invia questi cookies al sito web che li ha originati o ad un altro sito. I cookies permettono ai siti di ricordare alcune informazioni per permetterti di navigare online in modo semplice e veloce.</p>

<h3>I cookie presenti sul sito Muoversi in Piemonte</h3>
Questo sito internet utilizza solo cookies tecnici ed analitici, che possono essere utilizzati senza chiedere il consenso dell’utente, poiché sono strettamente necessari per l’esplorazione del sito e la fruizione dei servizi presenti.
Qui di seguito sono riportati i tipi cookie che possono essere utilizzati nel Sito con una descrizione della finalità legata all’uso.

<h4>Cookie di sessione o di navigazione</h4>
I cookie di questo tipo sono necessari per il corretto funzionamento di alcune aree del sito. I cookie di questa categoria comprendono sia cookie persistenti che cookie di sessione. In assenza di tali cookie, il sito o alcune porzioni di esso potrebbero non funzionare correttamente. Pertanto, vengono sempre utilizzati, indipendentemente dalle preferenze dall’utente. I cookie di questa categoria vengono sempre inviati dal dominio di Muoversi in Piemonte.

<h4>Cookie tecnici</h4>
I cookie di questo tipo vengono utilizzati per raccogliere informazioni sull’utilizzo del sito. Il Titolare usa tali informazioni per analisi statistiche, per migliorare il sito e semplificarne l’utilizzo, oltre che per monitorarne il corretto funzionamento. Questo tipo di cookie raccoglie informazioni in forma anonima sull’attività degli utenti nel sito e sul modo in cui sono arrivati al Sito e alle pagine visitate. I cookie di questa categoria vengono inviati dal Sito stesso o da domini di terze parti.
A tal proposito, si ricorda che su questo sito è in corso una rilevazione statistica tramite l’utilizzo dello strumento Google Analytics, che utilizza modalità di analisi secondo illustrate dal documento relativo alle <a href="http://www.google.it/policies/privacy/" target="_blank" rel="noopener noreferrer">Norme generiche sulla privacy di Google</a> e dal documento specifico in merito all’utilizzo delle informazioni <a href="http://www.google.com/analytics/terms/it.html" target="_blank" rel="noopener noreferrer">raccolte con Google Analytics</a>.

<h3>Come disabilitare i cookie</h3>
Nel caso si volesse bloccare cookie, si ricorda che questo potrebbe avere un impatto negativo sull’usabilità del sito web. La maggior parte dei browser permette di rifiutare/accettare i cookie. Di seguito si riportano alcune informazioni pratiche per disabilitare i cookie sul browser che si sta utilizzando.

<h4>Google Chrome</h4>
Cliccare la chiave inglese nell’angolo in alto a destra e selezionare ‘Impostazioni’. A questo punto selezionare ‘Mostra impostazioni avanzate’ (“Under the hood’”) e cambiare le impostazioni della ‘Privacy’.

<h4>Microsoft Internet Explorer</h4>
Cliccare l’icona ‘Strumenti’ nell’angolo in alto a destra e selezionare ‘Opzioni internet’. Nella finestra pop up selezionare ‘Privacy’. Qui potrete regolare le impostazioni dei vostri cookies.

<h4>Mozilla Firefox</h4>
Dal menu a tendina nell’angolo in alto a sinistra selezionare ‘Opzioni’. Nella finestra di pop up selezionare ‘Privacy’. Qui potrete regolare le impostazioni dei vostri cookies.

<h4>Safari</h4>
Dal menu di impostazione a tendina nell’angolo in alto a destra selezionare ‘Preferenze’. Selezionare ‘Sicurezza’ e qui potrete regolare le impostazioni dei vostri cookies.

Per disabilitare i cookie analitici e impedire a Google Analytics di raccogliere dati sulla propria navigazione, si può scaricare il <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">componente aggiuntivo del browser</a> per la disattivazione di Google Analytics.
        </article>
      </MIPPage>
  )
}
