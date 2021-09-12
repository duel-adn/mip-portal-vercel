/**
    (C) Duel srl 2021.

    Card per la visualizzaizione di un servizio di MIP.

    Revision history

    | Data       | Autore | Descrizione 
    | ---------- | ------ | ----------------------------------- |
    | 2021/08/10 | Duel   | Prima versione                      |
*/
import styles from './MIPService.module.scss'

export default function MIPServiceCard(props) {
    const service = props.service
    return (
    <div className={styles.service_card}>
        <h2 className={styles.title}>{service.title}</h2>
        <p className={styles.description}>{service.subtitle}</p>
        <div className={styles.toolbar}>
            <img src={service.icon}/>
            <a href={service.url}>Scopri di più</a>
        </div>
    </div>
    )
}