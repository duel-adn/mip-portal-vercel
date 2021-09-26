/**
    (C) Duel srl 2021.

    Header secondario delle pagine (non compare su mobile)

    Revision history

    | Data       | Autore | Descrizione 
    | ---------- | ------ | ----------------------------------- |
    | 2021/08/10 | Duel   | Prima versione                      |
*/

import styles from './MIPPageHeader.module.scss'

/**
 * Header sedondario
 * 
 * @param {*} props le property dell'elemento
 * @param props.className classe da aggiungere all'elemento esterno
 * 
 * @returns il template dell'elemento
 */
 export default function MIPSecondaryHeader(props) {
    const className=`${props.className} ${styles.secondary_header}`
    return (
        <nav className={className}>
            <div className={styles.tools}>
                <a className={styles.link} href="https://twitter.com/MIPiemonte" target="_blank" rel="noreferrer noopener">
                    <span>Seguici su</span>
                    <img className={styles.icon} src="/icons/twitter.svg" alt="twitter" />
                </a>
                <select>
                    <option value="IT">IT</option>
                    <option value="EN">EN</option>
                </select>
                <button className="mip-md-none">Area riservata</button>
            </div>
        </nav>
    )
}