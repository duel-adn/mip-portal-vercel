/**
    (C) Duel srl 2021.

    Header della pagina

    Revision history

    | Data       | Autore | Descrizione 
    | ---------- | ------ | ----------------------------------- |
    | 2021/08/10 | Duel   | Prima versione                      |
*/

import styles from './MIPPageHeader.module.scss'

import { useState } from 'react'

import Link from 'next/link'
import useTranslation from 'next-translate/useTranslation'

import MIPSecondaryHeader from './MIPSecondaryHeader'
import MIPSearchBar from './MIPSearchBar'
import MIPTrafficNewsPlayback from '../forms/MIPTrafficNewsPlayback'

function history_back() {
    if (window && window.history) {
        window.history.back()
    }
}

/**
 * Link da inserire nella navigation bar
 */
const navbarLinks = [
    { title: 'Home', url: '/' },
    { title: 'Percorso', url: '/planner' },
    { title: 'Traffico', url: '/traffic' },
    // { title: 'Trasporto pubblico', url: '/tpl' },
    { title: 'Alternativa', url: '/mobility' },
    { title: 'Servizio', url: '/service' },
    { title: 'Contatti', url: '/contacts' },
]

/**
 * La barra dei pulsanti che compare su dispositivi mobile
 * 
 * @param {*} props le property dell'elemento
 * @param props.className classe da aggiungere all'elemento html esterno
 * @param props.open true se il menu è aperto
 * @param props.onChange funzione da chiamare quando il pulsante di apertura menu viene premuto
 * 
 * @returns il template dell'elemento che contiene i pulsanti
 */
function MIPMobileButtonBar(props) {
    const className = `${props.className || ''} ${styles.mobile_button_bar}`
    return (
        <div className={className}>
            <button className={styles.toolbar_btn}>
                <img src="/icons/toolbar-search.svg" alt="search" />
            </button>
            <button className={styles.toolbar_btn}>
                <img src="/icons/toolbar-user.svg" alt="user" />
            </button>
            <button className={styles.toolbar_btn} onClick={() => props.onChange()}>
                {props.open ?
                    <img src="/icons/menu-button-open.svg" alt="" />
                    :
                    <img src="/icons/menu-button-closed.svg" alt="" />
                }
            </button>
        </div>
    )
}

/**
 * L'elemento responsive che racchiude la navbar e 
 * il pulsante per il bollettino
 * 
 * @param {*} props le property dell'elemento
 * @param props.className classe da aggiungere all'elemento html esterno
 * @param props.links link da inserire nella navbar
 * @returns il template dell'elemento con il menu principale
 */
function MIPMainMenubar(props) {
    const { t, lang } = useTranslation('common')
    const className = `${props.className || ''} ${styles.menubar}`
    return (
        <div className={className}>
            <nav>
                <ul>
                    {props.links.map(item =>
                        <li key={item.title} >
                            <Link href={item.url}>
                                <a className={styles.nav_link}>
                                    {t(item.title)}
                                </a>
                            </Link>
                        </li>
                    )}
                </ul>
            </nav>
            <div className={styles.toolbar}>
                <MIPTrafficNewsPlayback audioUrl={process.env.MIP_TRAFFIC_NEWS_URL} />
            </div>
            <div className="mip-md-block">
                <MIPSecondaryHeader className="mip-md-block mip-bg-dark " />
            </div>
        </div>
    )
}

/**
 * La toolbar principale, con logo, navigazione e altri elementi
 * 
 * @param {*} props le property dell'elemento
 * @param props.className classe da aggiungere all'elemento html esterno
 * 
 * @returns il template dell'elemento che racchiude la toolbar principale
 */
function MIPMainToolbar(props) {
    const [menuOpen, setMenuOpen] = useState(false)
    const className = `${props.className || ''} ${styles.main_toolbar}`
    return (
        <div className={className}>
            <div className={styles.logo}>
                <Link href="/"><a><img src='/images/logo.svg' height="52" alt='Muoversi in piemonte' /></a></Link>
            </div>
            <MIPMainMenubar className={!menuOpen && "mip-md-none"} links={navbarLinks} />
            {/* <MIPSearchBar className="mip-dd-block" /> */}
            <MIPMobileButtonBar open={menuOpen}
                onChange={() => setMenuOpen(!menuOpen)} />
        </div>
    )
}

/**
 * L'intero header della pagina
 * 
 * @param {*} props le property dell'elemento
 * @param props.className classe da aggiungere all'elemento html esterno
 * @param {string} props.titleClassName il titolo della pagina
 * @param {string} props.titleClass la classe da assegnare al titolo delle pagine 
 * @param {string} props.breadcrumb il testo del breadcrumb (undefinde -> nascosto)
 * @returns il template dell'header della pagina di MIP
 */
export default function MIPPageHeader(props) {
    const titleClass = `${props.titleClassName || ''} ${styles.page_title}`
    const breadcrumbClass = `mip-bg-light ${styles.breadcrumb}`
    const className = `${props.className || ''} ${styles.page_header}`
    return (
        <header className={className}>
            <div className="mip-md-none mip-bg-dark">
                <div className="mip-page-section ">
                    <MIPSecondaryHeader className="mip-bg-dark" />
                </div>
            </div>
            <div className="mip-bg-light mip-w-100">
                <div className="mip-page-section">
                   <MIPMainToolbar className="mip-bg-light" />
                </div>
                { props.title &&
                    <div className={titleClass}>
                        <h1 className="mip-page-section">{props.title}</h1>
                    </div>
                }
                <div className="mip-page-section">
                    { props.breadcrumb &&
                        <div className={breadcrumbClass}>
                            <a onClick={() => history_back()}>{props.breadcrumb}</a>
                        </div>
                    }
                </div>
            </div>
        </header>
    )
}