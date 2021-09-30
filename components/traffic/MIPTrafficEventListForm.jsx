/**
    Duel S.p.A.

    Lista eventi traffico con box di ricerca

    Revision history

    | Data       | Autore | Descrizione 
    | ---------- | ------ | ----------------------------------- |
    | 2021/08/10 | Duel   | Prima versione                      |
*/

import styles from './MIPTraffic.module.scss'
import MIPTrafficEventList from './MIPTrafficEventList'

export default function MIPTrafficEventListForm({className, trafficEventData}) {
    return (
        <div className={className}>
            <div className={styles.search_panel}>
                <input type="text" placeholder="Cerca tra gli eventi di traffico" />
            </div>
            <MIPTrafficEventList trafficEventData={trafficEventData} compact={false} />
        </div>
    )
}