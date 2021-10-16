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

export default function MIPRoundedCheckbox({id, title, checked, icon, onChange}) {
    const [isChecked, setChecked] = useState(checked);

    const handleChange = () => {
        //setChecked(!isChecked);
        if (onChange) {
            onChange(id, !checked)
        }
    }

    const handleKey = (key) => {
        if (key.code === 'Space') { 
            handleChange()
            key.preventDefault()
            key.stopPropagation()
        }
    }
    return (

        <div className={styles.checkbox}>
            <div
                id={id}
                onClick={handleChange}
                onKeyDown={handleKey}
                className={`${styles.button} ${checked ? styles.checked : styles.normal}`} 
                tabIndex={0}
                // ARIA
                role="checkbox"
                aria-checked={checked ? true : false}
                aria-labelledby={`${id}-label`}
            >
                <img src={icon} />
            </div>
            <label id={`${id}-label`} className={styles.title}>{title}</label>
        </div>
    )
}