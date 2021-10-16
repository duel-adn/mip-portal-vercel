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

    const handleKey = (key) => {
        console.log('key = ' + key)
        if (key.code === 'Space') { 
            handleChange()
            key.preventDefault()
            key.stopPropagation()
        }
    }
    return (

        <div className={styles.checkbox}>
            <div
                onClick={handleChange}
                onKeyDown={handleKey}
                className={`${styles.button} ${checked ? styles.checked : styles.normal}`} 
                tabIndex={0}
                // ARIA
                role="checkbox"
                aria-checked={checked ? true : false}
                aria-labelledby={`${props.id}-label`}
            >
                <img src={props.icon} />
            </div>
            <label id={`${props.id}-label`} className={styles.title}>{props.title}</label>
        </div>
    )
}