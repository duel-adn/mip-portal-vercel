/**
    Duel S.p.A.

    Tab bar con informazioni di traffico complete e calcolo percorso.

    Revision history

    | Data       | Autore | Descrizione 
    | ---------- | ------ | ----------------------------------- |
    | 2021/08/10 | Duel   | Prima versione                      |
*/

import styles from './MIPTraffic.module.scss'
import MIPTabPanel from "../forms/MIPTabPanel"
import MIPPathDataForm from "../path/MIPPathDataForm"
import MIPMapPanel from '../map/MIPMapPanel'
import MIPTrafficEventList from './MIPTrafficEventList'
import MIPTrafficEventPanel from './MIPTrafficEventPanel'
export default function MIPTrafficTabPanel(props) {
    const className = `${props.className || ''} ${styles.traffic_tab_panel}`
    return (
        <div className={className}>
            <MIPTabPanel className = {styles.traffic_tab_panel}>
                <MIPPathDataForm 
                    className = {styles.path_data_form}
                    title="Percorso" 
                    headerClassName={`${styles.path_tab_title} mip-bg-blue`}
                    labelClassName={styles.path_label}/>
                <div className={`mip-bg-light ${styles.list_container}`}
                    title="Traffico" 
                    headerClassName={`${styles.traffic_tab_title} mip-bg-accent`}
                    labelClassName={styles.traffic_label}>
                    <MIPTrafficEventList eventData={props.eventData}/>
                </div>
            </MIPTabPanel>
            <MIPMapPanel className={styles.map_container2} trafficEventData={props.eventData}/>
        </div>
    )
}