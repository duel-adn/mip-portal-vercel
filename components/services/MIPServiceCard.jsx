/**
    (C) Duel srl 2021.

    Card per la visualizzaizione di un servizio di MIP.

    Revision history

    | Data       | Autore | Descrizione 
    | ---------- | ------ | ----------------------------------- |
    | 2021/08/10 | Duel   | Prima versione                      |
*/
import styles from './MIPService.module.scss'

// TODO: Acccessibilità immagine

export default function MIPServiceCard(props) {
    const service = props.service
    const style = {
        backgroundImage:`url(${service.icon})`
    }
    return (
    <div className={styles.service_card}>
        <h2 className={styles.title}>{service.title}</h2>
        <p className={styles.description}>{service.subtitle}</p>
        <div style={style} className={styles.toolbar}>
            <a href={service.url}>Scopri di più</a>
        </div>
    </div>
    )
}