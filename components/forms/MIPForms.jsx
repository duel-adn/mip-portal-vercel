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

import { mipConcatenate } from '../../lib/MIPUtility';

/**
 * Componente usato per scorrere tra le pagine (ad esempio nelle news)
 * @param {String} className nome della classe del div esterno
 * @returns il componente React 
 */
function MIPPager({ className }) {
    const finalClassName = `${className || ''} ${styles.mip_pager}`;
    return (
        <div className={finalClassName}>
            <Link href="/article"><a><img src='/icons/chevron-left-gray.svg' alt="pagina precedente"></img></a></Link>
            <Link href="/article"><a className={styles.selected} href="">1</a></Link>
            <Link href="/article"><a>2</a></Link>
            <Link href="/article"><a>3</a></Link>
            <Link href="/article"><a>4</a></Link>
            <Link href="/article"><a><img src='/icons/chevron-right-blue.svg' alt="pagina seguente"></img></a></Link>
        </div>
    )
}

/**
 * Ritorna un componente che mostra un'animazione CSS ciclica 
 * @param {String} className nome della classe del div esterno
 * @returns il componente React 
 */
function MIPLoading({ className }) {
    return (
        <div className={className}>
            <div className={styles.mip_loading_panel}>
                <div className={styles.blue}></div>
                <div className={styles.gray}></div>
                <div className={styles.red}></div>
            </div>
        </div>
    )
}

/**
 * Componente generico usato per le legende
 * @param {String} className nome della classe del div esterno
 * @param {String} title titolo della legenda 
 * @param {Array} items elementi della legenda 
 * @returns il componente React
 */
function MIPLegend({ className, title, items }) {
    const finalClassName = `${className || ''} ${styles.traffic_legend}`;
    return (
        <div className={finalClassName}>
            <div className={styles.title}>{title}</div>
            <div className={styles.container}>

                {items && items.map(item =>
                    <div key={item.title} className={styles.item}
                        style={{ backgroundImage: `url(/map-icons/${item.icon}.svg)` }}>
                        {item.title}
                    </div>
                )}
            </div>
        </div>
    )
}

function MIPIconButtton({ className, icon, label, onClick }) {
    return (
        <button type="button" className={mipConcatenate(className, styles.icon_btn)}
            aria-label={label}
            onClick={onClick}>
            <img className={styles.icon} src={icon} alt={label} aria-hidden={true} />
        </button>
    )
}

function MIPIconTitle({ className, icon, title, subtitle, url }) {
    return (title ?
        <div className={className}>
            <div className={styles.icon_title}>
                {icon && <img className={styles.icon} src={icon} aria-hidden={true} alt={title} />}
                <h3 className={styles.title}>{title}</h3>
            </div>
            {subtitle &&
                <div className={styles.icon_subtitle}>
                    {url ?
                        <Link href={url}>
                            <a>{subtitle} &gt;</a>
                        </Link> : <p>{subtitle}</p>
                    }
                </div>
            }
        </div>
        : null)
}

export default {
    Pager: MIPPager,
    Loading: MIPLoading,
    Legend: MIPLegend,
    IconTitle: MIPIconTitle,
    IconButton: MIPIconButtton
}