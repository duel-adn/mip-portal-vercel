/**
    (C) Duel srl 2021.

    Home page.

    Revision history

    | Data       | Autore | Descrizione 
    | ---------- | ------ | ----------------------------------- |
    | 2021/08/10 | Duel   | Prima versione                      |
*/

import useTranslation from 'next-translate/useTranslation'
import MIPPage from '../components/page/MIPPage'
import MIP404Panel from '../components/page/MIP404Panel'

export default function Page404() {
  const { t } = useTranslation("common")
  return (
    <MIPPage.Page
      pageTitle={t("PageNotFound")}
      breadcrumb={t("GoBack")}>
        <MIP404Panel />
    </MIPPage.Page>
  )
}
