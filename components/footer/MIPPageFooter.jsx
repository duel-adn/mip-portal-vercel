/**
    (C) Duel srl 2021.

    Footer delle pagine del portale

    Revision history

    | Data       | Autore | Descrizione 
    | ---------- | ------ | ----------------------------------- |
    | 2021/08/10 | Duel   | Prima versione                      |
*/

import styles from './MIPPageFooter.module.scss'

import Link from 'next/link'

import useTranslation from 'next-translate/useTranslation'

/**
 * Footer delle pagine del portale.
 * 
 * @param {*} props property dell'elemento
 * @param {props.className} classe da aggiungere all'elemento esterno
 * @returns 
 */
export default function MIPPageFooter(props) {
    const className = `${props.className || ''} mip-bg-blue`
    const { t, lang } = useTranslation('common')
    return (
        <footer className={className} >
            <div className={`${styles.page_footer} mip-page-section`}>
                <nav className={styles.navbar}>
                    <ul>
                        {/* <li>
                            <Link href="#"><a>Mappa del sito</a></Link><span>|</span>
                        </li> */}
                        <li>
                            <Link href="/disclaimer"><a>{t('Disclaimer')}</a></Link><span>|</span>
                        </li>
                        <li>
                            <Link href="/cookies"><a>{t("Cookies")}</a></Link><span>|</span>
                        </li>
                        <li>
                            <Link href="/radio"><a>{t("Radio")}</a></Link><span>|</span>
                        </li>
                        <li>
                            <Link href="/contacts"><a>{t("Contatti")}</a></Link>
                        </li>
                    </ul>
                </nav>
                <div className={styles.credits}>
                    <div className={styles.credit}>
                        <p>{t("ServiceBy")}</p>
                        <img className={styles.piemonte} src="/images/logo-piemonte.svg" alt={t("Piemonte")} />
                    </div>
                    <div className={styles.credit}>
                        <p>{t("CollaborationWith")}</p>
                        <img className={styles.l5t} src="/images/logo-5t.svg" alt={t("5T")} />
                    </div>
                </div>
            </div>
        </footer>
    )
}
