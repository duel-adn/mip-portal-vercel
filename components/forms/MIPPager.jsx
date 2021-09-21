/**
    (C) Duel srl 2021.

    Paginazione .

    Revision history

    | Data       | Autore | Descrizione 
    | ---------- | ------ | ----------------------------------- |
    | 2021/08/10 | Duel   | Prima versione                      |
*/

import styles from './MIPForms.module.scss'
import Link from 'next/link'

export default function MIPPager(props) {
    const className = `${props.className || ''} ${styles.mip_pager}`;
    return (
        <div className={className}>
            <Link href="/article"><a><img src='/icons/chevron-left-gray.svg' alt="pagina precedente"></img></a></Link>
            <Link href="/article"><a className={styles.selected} href="">1</a></Link>
            <Link href="/article"><a>2</a></Link>
            <Link href="/article"><a>3</a></Link>
            <Link href="/article"><a>4</a></Link>
            <Link href="/article"><a><img src='/icons/chevron-right-blue.svg' alt="pagina seguente"></img></a></Link>
        </div>
    )
}