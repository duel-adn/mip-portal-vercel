/**
    (C) Duel srl 2021.

    Card per la visualizzaizione di un servizio di MIP.

    Revision history

    | Data       | Autore | Descrizione 
    | ---------- | ------ | ----------------------------------- |
    | 2021/08/10 | Duel   | Prima versione                      |
*/
import styles from './MIPService.module.scss'
import Link from 'next/link'

export default function MIPServiceCard({service, cta}) {
    const style = {
        backgroundImage:`url(${service.icon})`
    }
    return (
    <div className={styles.service_card}>
        <h2 className={styles.title}>{service.title}</h2>
        <p className={styles.description}>{service.subtitle}</p>
        <div style={style} className={styles.toolbar}>
            {service.external ?
                <a href={service.url} target="_blank" rel="noopener noreferrer">{cta}</a>
                :
                <Link href="{service.url}"><a>{cta}</a></Link>
            }
        </div>
    </div>
    )
}