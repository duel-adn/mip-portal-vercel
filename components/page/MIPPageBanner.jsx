/**
    (C) Duel srl 2021.

    Vari tipi di banner per le pagine.

    Revision history

    | Data       | Autore | Descrizione 
    | ---------- | ------ | ----------------------------------- |
    | 2021/08/10 | Duel   | Prima versione                      |
*/

import styles from './MIPPage.module.scss'
import Image from 'next/image'

export function MIPPageBanner(props) {
    const className = `${props.className || ''} ${styles.page_banner}`;

    const style = {
        height: props.height || "300px"
    }
    return (
        <div style={style} className={className}>
            <div className={styles.container}>
                <Image className={styles.image} src={props.image} layout='fill' objectFit="cover"/>
                {props.children}
            </div>
        </div>
    )
}

// TODO: add link 
export function MIPRealTimeBanner(props) {
    return (
        <MIPPageBanner className={props.className} image={props.image}>
            <div className={`mip-bg-light ${styles.real_time_alert}`}>
                <div className={`mip-large-tag mip-bg-accent ${styles.tag}`}>{props.tag}</div>
                <h2 className={styles.title}><a href="#">{props.title}</a></h2>
            </div>
        </MIPPageBanner>
    )
}