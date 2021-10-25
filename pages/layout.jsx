/**
    (C) Duel srl 2021.

    Pagina di test del layout.

    Revision history

    | Data       | Autore | Descrizione 
    | ---------- | ------ | ----------------------------------- |
    | 2021/08/10 | Duel   | Prima versione                      |
*/
import MIPBanner from '../components/page/MIPBanner'
import MIPPage from '../components/page/MIPPage'
import MIPPath from '../components/path/MIPPath'

export default function Layout({ eventData }) {
  return (
    <MIPPage className="mip-home-page1"
      pageTitle="Layout test">
        <main className="">
        <MIPBanner.CTABanner title="Nuovo bando mobilità sostenibile"
          linkTitle="scopri ora come partecipare"
          imageUrl="/news-images/bid-banner.png"/>
        <MIPPath.Controller className="mip-rounded-corners" responsive title="Calcola il percorso"/>
        <MIPBanner.EmergencyBanner title="EMERGENZA COVID"
          subtitle="Esenzione pagamento pedaggio per personale sanitario e associazioni di volontariato"
          iconUrl="/icons/ambulance.svg" linkUrl="#" />
        </main>
    </MIPPage>
  )
}
