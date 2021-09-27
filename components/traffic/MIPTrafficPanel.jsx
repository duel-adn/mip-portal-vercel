/**
    (C) Duel srl 2021.

    Pannello per gli eventi di traffico con mappa.

    Revision history

    | Data       | Autore | Descrizione 
    | ---------- | ------ | ----------------------------------- |
    | 2021/08/10 | Duel   | Prima versione                      |
*/

import styles from './MIPTraffic.module.scss';
import MIPTrafficEventPanel from './MIPTrafficEventPanel';
import MIPMapPanel from '../map/MIPMapPanel';

export default function MIPTrafficPanel(props) {
    const className = `${props.className || ''} ${styles.traffic_panel}`

    return (
        <div className={className}>
            <MIPTrafficEventPanel className={styles.data_container} trafficEventData={props.trafficEventData} compact={props.compact}/>
            <MIPMapPanel className={styles.map_container} trafficEventData={props.trafficEventData}/>
        </div>
    )
}