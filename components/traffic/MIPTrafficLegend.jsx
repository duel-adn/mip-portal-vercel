/**
    (C) Duel srl 2021.

    Legenda eventi di traffico.

    Revision history

    | Data       | Autore | Descrizione 
    | ---------- | ------ | ----------------------------------- |
    | 2021/08/10 | Duel   | Prima versione                      |
*/

import styles from './MIPTraffic.module.scss';

const items = [
    {
        title: 'Traffico scorrevole',
        icon: 'no-traffic'
    },
    {
        title: 'Traffico intenso',
        icon: 'light-traffic'
    },
    {
        title: 'Rallentamenti',
        icon: 'heavy-traffic'
    },
    {
        title: 'Code',
        icon: 'queued-traffic'
    },
    {
        title: 'Allerta meteo',
        icon: 'weather-event'
    },
    {
        title: 'Incidente',
        icon: 'accident-event'
    },
    {
        title: 'Videocamera',
        icon: 'traffic-camera'
    },
    {
        title: 'Chiusure',
        icon: 'closure-event'
    },
]

export default function MIPTrafficLegend(props) {
    const className = `${props.className || ''} ${styles.traffic_legend}`;
    return (
        <div className={className}>
            <div className={styles.title}>Legenda</div>
            <div className={styles.container}>

                { 
                items.map(item => 
                <div key={item.title} className={styles.item}
                    style={{ backgroundImage: `url(/map-icons/${item.icon}.svg)` }}>
                    {item.title}
                </div>
                )}
            </div>
        </div>
    )
}