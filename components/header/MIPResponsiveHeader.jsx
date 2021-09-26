import Link from 'next/link'
import { useState } from 'react'
import styles from './MIPPageHeader.module.scss'
import MIPSecondaryHeader from './MIPSecondaryHeader'
import MIPSearchBar from './MIPSearchBar'

// TODO: Move outside
const navbarData = [
    { title: 'Home', url: '/' },
    { title: 'Traffico', url: '/traffic' },
    { title: 'Trasporto pubblico', url: '/tpl' },
    { title: 'Mobilità alternativa', url: '/mobility' },
    { title: 'Il servizio', url: '/news' },
    { title: 'Contatti', url: '#' },
]

function MIPMobileButtonBar(props) {
    const className = `${props.className || ''} ${styles.mobile_button_bar}`
    return (
    <div className={className}>
        <button className={styles.toolbar_btn}>
            <img src="/icons/toolbar-search.svg" alt="" />
        </button>
        <button className={styles.toolbar_btn}>
            <img src="/icons/toolbar-user.svg" alt="" />
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
 * @param props.className classe da aggiungere all'elemento esterno
 * 
 * @returns l'elemento con il menu principale
 */
function MIPMainMenubar(props) {
    const className = `${props.className || ''} ${styles.menubar}`
    return (
        <div className={className}>
            <nav>
                <ul>
                    {props.links.map(item =>
                        <li><Link href={item.url}><a className={styles.nav_link}>{item.title}</a></Link></li>
                    )}
                </ul>
            </nav>
            <div className={styles.toolbar}>
                <button className={styles.traffic_news_btn}>Ascolta il notiziario sul traffico</button>
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
 * @param props.className classe da aggiungere all'elemento esterno
 * 
 * @returns l'elemento che racchiude la toolbar principale della pagina
 */
function MIPMainToolbar(props) {
    const [menuOpen, setMenuOpen] = useState(false)
    const className = `${props.className || ''} ${styles.main_toolbar}`
    return (
        <div className={className}>
            <div className={styles.logo}>
                <Link href="/"><a><img src='/images/logo.svg' height="48" alt='Muoversi in piemonte' /></a></Link>
            </div>
            <MIPMainMenubar className={!menuOpen && "mip-md-none"} links={navbarData} />
            <MIPSearchBar className="mip-dd-block"/>
            <MIPMobileButtonBar open={menuOpen} 
                onChange={() => setMenuOpen(!menuOpen)} />
        </div>
    )
}

/**
 * L'intero header della pagina
 * 
 * @param props.className classe da aggiungere all'elemento esterno
 * 
 * @returns l'header della pagina di MIP
 */
export default function MIPPageHeader(props) {
    const className = `${props.className || ''} ${styles.page_header}`
    return (
        <header className={className}>
            <div className="mip-md-none">
                <MIPSecondaryHeader className="mip-bg-dark " />
            </div>
            <MIPMainToolbar className="mip-bg-light"/>
        </header>
    )
}