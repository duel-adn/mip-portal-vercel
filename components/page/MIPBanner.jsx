/**
    (C) Duel srl 2021.

    Vari tipi di banner per le pagine.

    Revision history

    | Data       | Autore | Descrizione 
    | ---------- | ------ | ----------------------------------- |
    | 2021/08/10 | Duel   | Prima versione                      |
*/

import Image from 'next/image'
import Link from 'next/link'

import styles from "./MIPBanner.module.scss"
import {mipConcatenate} from "../../lib/MIPUtility"

/**
 * Banner con annuncio realtime e immagine che copre completamente
 * lo spazio a disposizione
 * 
 * @param {string} className nome della classe dell'elemento esterno
 * @param {string} height altezza del banner (default 100%)
 * @param {string} imageUrl url dell'immagine di background
 * @param {string} imageAlt alt dell'immagine
 * @param {string} title titolo dell'alert
 * @param {string} tagTitle titolo del tag (se null il tag non viene visualizzato) 
 *
 * @returns il componente banner
 */
export function MIPPageBanner({className, imageUrl, height, imageAlt, children}) {
    const finalClassName = mipConcatenate(className, styles.page_banner)

    const style = {
        height: height || "100%"
    }
    return (
        <div style={style} className={finalClassName}>
            <div className={styles.container}>
                <Image className={styles.image} 
                    src={imageUrl} alt={imageAlt}
                    layout='fill' objectFit="cover"
                />
                {children}
            </div>
        </div>
    )
}

/**
 * Banner generico con immagine che copre completamente
 * lo spazio a disposizione
 * 
 * @param {string} className nome della classe dell'elemento esterno
 * @param {string} height altezza del banner (default 100%)
 * @param {string} imageUrl url dell'immagine di background
 * @param {string} imageAlt alt dell'immagine
 * 
 * @returns il componente banner
 */

function MIPRealTimeBanner({className, imageUrl, height, imageAlt, title, tagTitle}) {
    return (
        <MIPPageBanner className={className} height={height}
            imageUrl={imageUrl} imageAlt={imageAlt}>
            {title && 
                <MIPRealTimeAlert className="mip-bg-light" title={title} tagTitle={tagTitle} />
            }
        </MIPPageBanner>
    )
}

/**
 * Avviso da usare nel banner
 * @param {string} className nome della classe dell'elemento esterno
 * @param {string} title titolo dell'alert
 * @param {string} tagTitle titolo del tag (se null il tag non viene visualizzato) 
 * 
 * @returns the real time alert component
 */
function MIPRealTimeAlert({className, title, tagTitle}) {
    const finalClassName = mipConcatenate(className, styles.real_time_alert)
    return ( 
        <div className={finalClassName}>
            {tagTitle && 
                <div className={`mip-large-tag mip-bg-accent ${styles.tag}`}>{tagTitle}</div>
            }
            <h2 className={styles.title}><a href="#">{title}</a></h2>
        </div>
    )
}

/**
 * Call to action per il banner
 * 
 * @param {string} className nome della classe dell'elemento esterno
 * @param {string} url url da associare al link (default: #)
 * @param {string} title titolo della CTA
 * @param {string} linkTitle titolo del link
 * 
 * @returns componente call to action
 */
function MIPCTACard({className, title, linkTitle, url}) {
    const finalUrl = url || "#"
    const finalClassName = mipConcatenate(className, styles.cta_container)
    return (
    <div className={finalClassName}>
        <h3 className={styles.title}>{title}</h3>
        <Link href={finalUrl}><a className={"mip-large-button" + " " + styles.link}>{linkTitle}</a></Link>
    </div>
    )
}

/**
 * Banner con CTA e immagine
 * @param {string} className nome della classe dell'elemento esterno
 * @param {string} height altezza del banner (default 100%)
 * @param {string} imageUrl url dell'immagine di background
 * @param {string} url url da associare al link (default: #)
 * @param {string} title titolo della CTA
 * @param {string} linkTitle titolo del pulsante che rappresenta il link
 * @returns banner con call to action
 */
function MIPCTABanner({className, imageUrl, title, linkTitle, url}) {
    const finalClassName = mipConcatenate(className, styles.cta_banner)
    return (
        <div className={finalClassName}>
            <MIPCTACard className="mip-bg-accent" 
                title={title} linkTitle={linkTitle} url={url}
            /> 
            <div className={styles.img_container}>
                <Image className={styles.image} src={imageUrl} 
                    layout='fill' objectFit="cover"/>
            </div>
        </div>
    )
}

/**
 * Banner di emergenza
 * @param {string} className nome della classe dell'elemento esterno
 * @param {string} title titolo del banner
 * @param {string} subtitle sottotitolo del banner (facoltativo)
 * @param {string} iconUrl url dell'icona (facoltativo)
 * @returns l'elemento REACT
 */
function MIPEmergencyBanner({className, title, subtitle, iconUrl, linkUrl}) {
    const finalClassName = mipConcatenate(className, styles.emergency_banner)
    const iconStyle = iconUrl && { backgroundImage: `url(${iconUrl})` }
    return (
        <div className={finalClassName} style={iconStyle}>
            <h4 class={styles.title}>{title}</h4>
            {subtitle && 
            <p class={styles.subtitle}>{subtitle}</p>
            }
            {linkUrl && 
                <Link href={linkUrl}><a className={styles.link}>{"leggi di più"}</a></Link>
            }
        </div>
    )
}

/**
 * Oggetto esportato
 */
const MIPBanner = {
    RTAlert: MIPRealTimeAlert,
    CTAAlert: MIPCTACard,
    Banner: MIPPageBanner,
    RTBanner: MIPRealTimeBanner,
    CTABanner: MIPCTABanner,
    EmergencyBanner: MIPEmergencyBanner
}

export default MIPBanner