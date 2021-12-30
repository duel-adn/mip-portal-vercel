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
      pageTitle="Dati - Muoversi in Piemonte"
      title="Dati inerenti al servizio di trasporto pubblico"
      titleClassName="mip-bg-blue"
      breadcrumb={t("GoBack")}>
      <article className="mip-mb-2 mip-temp-page">
        <p>I dati inerenti al servizio di trasporto pubblico (quali localizzazione delle fermate,
          orari e percorsi) sono stati forniti dalle amministrazioni provinciali e comunali della
          Regione Piemonte e dalle aziende piemontesi di trasporto pubblico aderenti al sistema 
          BIP – Biglietto Integrato Piemonte.</p>
        <p>Le informazioni sono generalmente aggiornate con cadenza trimestrale. Nel caso in cui 
          l’aggiornamento non avvenga secondo tali tempistiche, alcune località potrebbero risultare non raggiungibili con 
          i servizi di trasporto pubblico.
        </p>
      </article>
    </MIPPage.Page>
  )
}
