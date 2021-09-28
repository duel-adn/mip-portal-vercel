/**
    (C) Duel srl 2021.

    Stili per i pannello altri servizi di MIP.

    Revision history

    | Data       | Autore | Descrizione 
    | ---------- | ------ | ----------------------------------- |
    | 2021/08/10 | Duel   | Prima versione                      |
*/

import styles from './MIPService.module.scss'
import MIPServiceCard from './MIPServiceCard'

const serviceData = [
    {
        id: 1,
        title: "I colli alpini in Piemonte",
        subtitle: "L’apertura dei principali colli alpini piemontesi",
        icon: "/icons/colli-alpini.svg",
        url: "/passes",
        external: false
    },
    {
        id: 2,
        title: "Visita il Piemonte",
        subtitle: "Piemonte. L’esperienza che non ti aspetti",
        icon: "/icons/visita-piemonte.svg",
        url: "https://www.visitpiemonte.com/it",
        external: true
    },
    {
        id: 3,
        title: "Orari dei treni",
        subtitle: "Controlla gli orari della rete ferroviaria del Piemonte",
        icon: "/icons/train-timetable.svg",
        url: "https://www.sfmtorino.it/orari/",
        external: true
    },
    {
        id: 4,
        title: "Orario dei voli",
        subtitle: "Controlla l'orario dei voli dagli aeroporti piemontesi",
        icon: "/icons/flight-timetable.svg",
        url: "https://www.aeroportoditorino.it/it",
        external: true
    }
]

export default function MIPServicePanel(props) {
    const className = `${props.className || ''} ${styles.service_panel}`;
    return (
    <div className={className}>
        {
            serviceData.map(service => 
                <MIPServiceCard key={service.id} service={service} />
            )
        }
    </div>
    )
}