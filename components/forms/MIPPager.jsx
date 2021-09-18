/**
    (C) Duel srl 2021.

    Paginazione .

    Revision history

    | Data       | Autore | Descrizione 
    | ---------- | ------ | ----------------------------------- |
    | 2021/08/10 | Duel   | Prima versione                      |
*/

import styles from './MIPForms.module.scss'

export default function MIPPager(props) {
    const className = `${props.className || ''} ${styles.mip_pager}`;
    return (
        <div className={className}>
            <a href=""><img src='/icons/chevron-left-gray.svg'></img></a>
            <a className={styles.selected} href="">1</a>
            <a href="/article">2</a>
            <a href="/article">3</a>
            <a href="/article">4</a>
            <a href="/article"><img src='/icons/chevron-right-blue.svg'></img></a>
        </div>
    )
}