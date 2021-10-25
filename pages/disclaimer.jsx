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
      pageTitle="Disclaimer"
      title="Disclaimer" 
        titleClassName="mip-bg-blue"
        breadcrumb='Indietro'>
        <article className="mip-mt-2 mip-temp-page">
        <p><Link href="/"><a>Muoversi in Piemonte</a></Link> utilizza OpenStreetMap come base cartografica, un progetto collaborativo finalizzato a creare mappe mondiali a contenuto libero e aggiornato quotidianamente da utenti liberi e indipendenti.</p>
        <p>Si ricorda pertanto che:</p>

<ul>
  <li>sebbene in costante miglioramento, la mappa potrebbe non essere del tutto completa o aggiornata</li>
  <li>nel riconoscimento degli indirizzi per il punto di partenza e il punto di arrivo potranno verificarsi errori o imprecisioni</li>
  <li>i dati inerenti al servizio di trasporto pubblico (quali localizzazione delle fermate, orari e percorsi) sono stati forniti 
    dalle <a href="https://www.muoversinpiemonte.it/page/dati" target="_blank" rel="noopener noreferrer">Amministrazioni provinciali e comunali della Regione Piemonte e dalle aziende piemontesi di trasporto pubblico</a> e sono generalmente aggiornati con cadenza trimestrale. Nel caso in cui l’aggiornamento non avvenga secondo tali tempistiche, alcune località potrebbero risultare non raggiungibili con i servizi di trasporto pubblico.</li>
</ul> 

<h3>CONDIVISIONE DELLA POSIZIONE</h3>
<p>Attraverso il sito <Link href="/"><a>www.muoversinpiemonte.it</a></Link>, è possibile condividere la propria posizione allo scopo di migliorare l’utilizzo del servizio.</p>
<p>I dati inerenti alla posizione sono trattati in forma anonima, in un formato che non consente di identificare personalmente l’utente, e utilizzati al solo fine di facilitare la fruizione del servizio di calcolo percorso. I servizi di localizzazione e di posizione possono essere attivati o disattivati dall’utente in qualunque momento accedendo alle impostazioni del proprio dispositivo o del browser di navigazione utilizzato.</p>

<h3>SOCIAL MEDIA POLICY</h3>
<h4>Chi e dove</h4>
<p>Muoversi in Piemonte utilizza Twitter per diffondere informazioni sulla situazione del traffico e della viabilità in Piemonte.  Il canale è gestito da uno staff interno dedicato. Qui di seguito si definiscono le linee guida (“netiquette”) per l’utilizzo del canale social. Tale utilizzo avviene nel rispetto delle norme di legge.</p>

<h4>Contenuti</h4>
<p>Il canale attivato viene utilizzato per fornire agli utenti informazioni aggiornate e in tempo reale sulla situazione del traffico e 
  della viabilità in Piemonte. Gli utenti possono utilizzarlo per condividere le informazioni, inviare commenti, richieste, domande, critiche e suggerimenti. Lo staff si riserva di condividere post di utenti, previa verifica delle segnalazioni ricevute con fonti certificate. Non saranno condivisi contenuti pubblicitari. I canali si avvalgono di propri contenuti testuali, fotografie, infografiche, video e altri materiali multimediali che sono da 
  considerarsi in licenza <a href="http://creativecommons.org/licenses/by-nd/3.0/it/deed.it" target="_blank" rel="noopener noreferrer">Creative Commons CC BY-ND 3.0</a>: significa che possono essere riprodotti liberamente, anche al di fuori dei canali, ma devono sempre essere accreditati al canale originale di riferimento.</p>

<h4>Commenti</h4>
<p>Commenti e post degli utenti rappresentano l’opinione dei singoli e non quella del servizio, che non può essere ritenuta responsabile della veridicità o meno di ciò che viene postato sulla pagina da terzi. I post e i commenti di terzi possono essere rimossi secondo precise regole di moderazione. Le regole circa i processi di moderazione sono presentate nel paragrafo successivo.</p>

<h4>Moderazione</h4>
<p>Tutti hanno il diritto di intervenire ed esprimere la propria libera opinione. Il servizio invita a una conversazione educata, pertinente e rispettosa. Il canale social di Muoversi in Piemonte non prevede alcuna moderazione preventiva. Tuttavia saranno rimossi commenti e post che siano discriminatori o offensivi nei confronti di altri utenti o cittadini, presenti o meno alla discussione, di enti, associazioni, aziende o di chi gestisce e modera la pagina stessa. Non saranno tollerati insulti, turpiloquio, minacce o atteggiamenti che ledano la dignità personale, i diritti delle minoranze e dei minori, i principi di libertà e uguaglianza.</p>
<p>Verranno inoltre moderati i commenti che risultano fuori argomento rispetto alla discussione di un determinato post (off topic), i commenti o i post che presentano dati sensibili in violazione della Legge sulla Privacy, gli interventi inseriti ripetutamente, i commenti e i post scritti per disturbare la discussione o offendere chi gestisce e modera i canali social, i commenti contenenti pubblicità, lo spam.</p>
<p>Per chi dovesse violare ripetutamente queste condizioni, lo staff si riserva il diritto di usare il ban o il blocco per impedire ulteriori interventi e di segnalare l’utente ai responsabili della piattaforma e, in ultima istanza e in presenza di violazioni particolarmente gravi o continuate, alle forze dell’ordine preposte.</p>
        </article>
      </MIPPage.Page>
  )
}
