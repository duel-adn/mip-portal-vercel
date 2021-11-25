/**
    (C) Duel srl 2021.

    Legenda eventi di traffico.

    Revision history

    | Data       | Autore | Descrizione 
    | ---------- | ------ | ----------------------------------- |
    | 2021/08/10 | Duel   | Prima versione                      |
*/

import styles from './MIPForms.module.scss';

export default function MIPLegend({className, items}) {
    const finalClassName = `${className || ''} ${styles.traffic_legend}`;
    return (
        <div className={finalClassName}>
            <div className={styles.title}>Legenda</div>
            <div className={styles.container}>

                { items && items.map(item => 
                <div key={item.title} className={styles.item}
                    style={{ backgroundImage: `url(/map-icons/${item.icon}.svg)` }}>
                    {item.title}
                </div>
                )}
            </div>
        </div>
    )
}