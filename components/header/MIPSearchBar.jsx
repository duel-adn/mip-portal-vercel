/**
    (C) Duel srl 2021.

    Box di ricerca nella toolbar

    Revision history

    | Data       | Autore | Descrizione 
    | ---------- | ------ | ----------------------------------- |
    | 2021/08/10 | Duel   | Prima versione                      |
*/

import styles from './MIPPageHeader.module.scss'

/**
 * Box di ricerca nel portale
 * 
 * @param {*} props le property dell'elemento
 * 
 * @returns il template dell'elemento
 */
 export default function MIPSearchBar(props) {
    const className = `${props.className || ''} ${styles.search_bar}`
    return (
        <div className={className}>
            <input type="text" placeholder="Cerca sul sito" />
        </div>
    )
}
