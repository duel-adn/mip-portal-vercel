/**
    (C) Duel srl 2021.

    Tab panel generico

    Revision history

    | Data       | Autore | Descrizione 
    | ---------- | ------ | ----------------------------------- |
    | 2021/08/10 | Duel   | Prima versione                      |
*/

import { useState } from 'react';
import styles from './MIPForms.module.scss'

export default function MIPTabPanel(props) {

    const className = `${props.className || ''} ${styles.tab_panel}` 

    const [selected, setSelected] = useState(props.selected || 0);

    return (
        <div className={className}>
            <div className={styles.tab_bar}>
                {props.children.map((tab, index) => 
                    <div key={index} className={`${styles.tab_header} ${tab.props.headerClassName || ''}`} 
                        onClick={() => setSelected(index)}>
                        <h2 className={tab.props.labelClassName || ''}>{tab.props.title}</h2>
                    </div>
                )}
            </div>
            <div className={styles.tab_container}>
            {
                props.children.map((child, index) => 
                    <div key={index} className={index==selected ? styles.visible : styles.hidden}>
                    {child}
                    </div>
                )
            }
            </div>
        </div>
    )
}