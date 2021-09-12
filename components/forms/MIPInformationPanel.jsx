/**
    (C) Duel srl 2021.

    Pannello per informazioni generiche.

    Revision history

    | Data       | Autore | Descrizione 
    | ---------- | ------ | ----------------------------------- |
    | 2021/08/10 | Duel   | Prima versione                      |
*/

import styles from './MIPForms.module.scss';

export default function MIPInformationPanel(props) {
    const className = `${props.className || ''} ${styles.information_panel}`;
    return (
        <div className={className}>
            <div className={`mip-bg-accent ${styles.panel_header}`}>
                <h3 className={styles.title}>{props.title}</h3>
            </div>
            <div className={`mip-bg-light ${styles.content}`}>
                {props.children}
            </div>
        </div>
    )
}