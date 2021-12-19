/**
    (C) Duel srl 2021.

    Contenuto pagina 404.

    Revision history

    | Data       | Autore | Descrizione 
    | ---------- | ------ | ----------------------------------- |
    | 2021/08/10 | Duel   | Prima versione                      |
*/

import styles from './MIPPage.module.scss'

import Link from 'next/link';
import useTranslation from 'next-translate/useTranslation'

export default function MIP404Panel(props) {
    const { t } = useTranslation("common")
    const className = `${props.className || ''} ${styles.page_404}`;

    return (
        <div className={className}>
            <img src='/images/not-found.svg' alt="donna con binocolo"/>
            <div className={styles.container}>
                <h2>{t("SorryNotFound")}</h2>
                <p>{t("PageSuggestion")}</p>
                <ul>
                <li><Link href="/traffic"><a className={styles.link}>{t("TrafficPage")}</a></Link></li>
                <li><Link href="/planner" ><a className={styles.link}>{t("PlannerPage")}</a></Link></li>
                <li><Link href="/colli"><a className={styles.link}>{t("PassesPage")}</a></Link></li>
                <p>{t("Otherwise")}</p>
                <li><Link href="/"><a className={styles.home_link}>{t("GoHome")}</a></Link></li>
                </ul>
            </div>
        </div>

    )
    
}