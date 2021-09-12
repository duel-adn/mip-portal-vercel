/**
    (C) Duel srl 2021.

    Header per eventi di emergenza.

    Revision history

    | Data       | Autore | Descrizione 
    | ---------- | ------ | ----------------------------------- |
    | 2021/08/10 | Duel   | Prima versione                      |
*/

import styles from './MIPHeader.module.scss';

export default function MIPEmergencyHeader(props) {
    const style = {
        backgroundImage: `url(${props.icon})`
    }
    return (
        <div style={style} className={styles.emergency_header}>
            {props.title && <h2>{props.title}</h2>}
            <div className={styles.text_container}>
                {props.text && <p>{props.text}</p>}
                {props.url && <a href={props.url}>Leggi di più</a>}
            </div>
        </div>
    )
}