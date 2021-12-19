/**
    (C) Duel srl 2021.

    Utility per form

    Revision history

    | Data       | Autore | Descrizione 
    | ---------- | ------ | ----------------------------------- |
    | 2021/08/10 | Duel   | Prima versione                      |
*/

import styles from './MIPForms.module.scss'

import Link from 'next/link'

function MIPPager(props) {
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

function MIPLoading({className}) {
    return (
        <div className={className}>
            <div class={styles.mip_loading_panel}>
            <div class={styles.blue}></div>
            <div class={styles.gray}></div>
            <div class={styles.red}></div>
            </div>
        </div>
    )
}

function MIPLegend({className, title, items}) {
    const finalClassName = `${className || ''} ${styles.traffic_legend}`;
    return (
        <div className={finalClassName}>
            <div className={styles.title}>{title}</div>
            <div className={styles.container}>

                { items && items.map(item => 
                <div key={item.title} className={styles.item}
                    style={{ backgroundImage: `url(/map-icons/${item.icon}.svg)` }}>
                    {item.title}
                </div>
                )}
            </div>
        </div>
    )
}

export default {
    Pager: MIPPager,
    Loading: MIPLoading,
    Legend: MIPLegend
}