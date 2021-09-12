/**
    (C) Duel srl 2021.

    Pannello per gli eventi di traffico.

    Revision history

    | Data       | Autore | Descrizione 
    | ---------- | ------ | ----------------------------------- |
    | 2021/08/10 | Duel   | Prima versione                      |
*/

import styles from './MIPTraffic.module.scss';
import MIPTrafficEventList from './MIPTrafficEventList';

export default function MIPTrafficEventPanel(props) {
    const className = `${props.className} || '' ${styles.traffic_event_panel}`;
    
    return (
        <div className={className}>
            <div className={`mip-bg-accent ${styles.panel_header}`}>
                <h3 className={styles.title}>Tempo reale</h3>
                <h4 className={styles.subtitle}>Scopri le news sul traffico in tempo reale</h4>
            </div>
            <div className={`mip-bg-light ${styles.list_container}`}>
                <MIPTrafficEventList eventData={props.eventData} />
            </div>
            <div className={`mip-bg-light ${styles.panel_footer}`}>
                <button className="mip-large-button mip-bg-accent">Vai al traffico in tempo reale</button>
            </div>
        </div>
    )
}