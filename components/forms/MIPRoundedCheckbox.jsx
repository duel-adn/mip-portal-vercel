/**
    Duel S.p.A.

    Componente che simula un checkbox, dotato di un'immagine e di
    un testo descrittivo.

    Revision history

    | Data       | Autore | Descrizione 
    | ---------- | ------ | ----------------------------------- |
    | 2021/08/10 | Duel   | Prima versione                      |
*/

import styles from './MIPForms.module.scss';

import { useState } from 'react';

export default function MIPRoundedCheckbox(props) {
    const [checked, setChecked] = useState(props.checked);

    const handleChange = () => {
        setChecked(!checked);
    };

    return (
        <div className={styles.checkbox}>
            <div
                onClick={handleChange}
                className={`${styles.button} ${checked ? styles.checked : styles.normal}`}>
                <img src={props.icon} />
            </div>
            <p className={styles.title}>{props.title}</p>
        </div>
    )
}