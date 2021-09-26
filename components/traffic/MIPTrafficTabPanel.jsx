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
export default function MIPTrafficTabPanel(props) {
    const className = `${props.className || ''} ${styles.traffic_tab_panel}`
    return (
        <div className={className}>
            <MIPTabPanel className = {styles.traffic_tab_panel} selected={props.selected || 0}>
                <MIPPathDataForm 
                    className = {styles.path_data_form}
                    title="Percorso" 
                    headerClassName={`${styles.path_tab_title} mip-bg-blue`}
                    labelClassName={styles.path_label}/>
                <div className={`mip-bg-light ${styles.list_container}`}
                    title="Traffico">
                    <div className={styles.search_panel}>
                        <input type="text" placeholder="Cerca tra gli eventi di traffico"/>
                    </div>
                    <MIPTrafficEventList eventData={props.eventData} compact={false}/>
                </div>
            </MIPTabPanel>
            <MIPMapPanel className={styles.map_container2} trafficEventData={props.eventData}/>
        </div>
    )
}