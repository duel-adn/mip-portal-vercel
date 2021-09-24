/**
    (C) Duel srl 2021.

    Lista eventi di traffico.

    Revision history

    | Data       | Autore | Descrizione 
    | ---------- | ------ | ----------------------------------- |
    | 2021/08/10 | Duel   | Prima versione                      |
*/
import styles from './MIPTraffic.module.scss';
import MIPTrafficEventCard from './MIPTrafficEventCard';

export default function MIPTrafficEventList(props) {
    const compact = props.compact === undefined ? true : props.compact
    return (
        <div className={`${props.className} ${styles.traffic_event_list}`}>
            <div className={`${props.className} ${styles.traffic_event_panel}`}>
            {props.eventData && props.eventData.map(event => 
                <MIPTrafficEventCard className={styles.event} key={event.id} event={event} compact={compact} />
            )}
            </div>
        </div>
    )
}

export async function fetchTrafficEventData(context) {
    const res = await fetch(process.env.MIP_TRAFFIC_EVENT_URL)
    const events = await res.json()
    console.log(process.env.MIP_TRAFFIC_EVENT_URL + ' ' + events.length)
    return events
}
