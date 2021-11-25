/**
    (C) Duel srl 2021.

    Footer delle pagine del portale

    Revision history

    | Data       | Autore | Descrizione 
    | ---------- | ------ | ----------------------------------- |
    | 2021/08/10 | Duel   | Prima versione                      |
*/

import Link from 'next/link'
import styles from './MIPPageFooter.module.scss';

/**
 * Footer delle pagine del portale.
 * 
 * @param {*} props property dell'elemento
 * @param {props.className} classe da aggiungere all'elemento esterno
 * @returns 
 */
export default function MIPPageFooter(props) {
    const className = `${props.className || ''} mip-bg-blue`
    return (
        <footer className={className} >
            <div className={`${styles.page_footer} mip-page-section`}>
                <nav className={styles.navbar}>
                    <ul>
                        <li>
                            <Link href="#"><a>Mappa del sito</a></Link><span>|</span>
                        </li>
                        <li>
                            <Link href="/disclaimer"><a>Disclaimer</a></Link><span>|</span>
                        </li>
                        <li>
                            <Link href="/cookies"><a>Cookies</a></Link><span>|</span>
                        </li>
                        <li>
                            <Link href="/radio"><a>Radio</a></Link><span>|</span>
                        </li>
                        <li>
                            <Link href="/contacts"><a>Contatti</a></Link>
                        </li>
                    </ul>
                </nav>
                <div className={styles.credits}>
                    <div className={styles.credit}>
                        <p>Un servizio di</p>
                        <img className={styles.piemonte} src="/images/logo-piemonte.svg" alt="regione piemonte" />
                    </div>
                    <div className={styles.credit}>
                        <p>In collaborazione con</p>
                        <img className={styles.l5t} src="/images/logo-5t.svg" alt="regione piemonte" />
                    </div>
                </div>
            </div>
        </footer>
    )
}
