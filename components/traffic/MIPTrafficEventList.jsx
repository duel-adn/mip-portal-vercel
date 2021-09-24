/**
    (C) Duel srl 2021.

    Lista eventi di traffico.

    Revision history

    | Data       | Autore | Descrizione 
    | ---------- | ------ | ----------------------------------- |
    | 2021/08/10 | Duel   | Prima versione                      |
*/
import styles from './MIPTraffic.module.scss';

export default function MIPTrafficEventList(props) {
    const compact = props.compact === undefined ? true : props.compact
    return (
        <div className={`${props.className} ${styles.traffic_event_list}`}>
            <div className={`${props.className} ${styles.traffic_event_panel}`}>
            {props.eventData && props.eventData.map(event => 
            compact ?
                <div key={event.id} className={styles.event}>
                    <p className={styles.title}
                    style={{'backgroundImage': 'url("/icons/car.svg")'}}>{event.road}</p>
                    <div className={styles.container}>
                    <p className={styles.text}>{event.what}</p>
                    <p className={styles.text}>{event.where}</p>
                    </div>
                </div>
            :
                <div key={event.id} className={styles.event}>
                    <p className={styles.title} style={{'backgroundImage': 'url("/icons/car.svg")'}}>{event.road}</p>
                    <div className={styles.container}>
                        <p className={styles.where}>{event.where}</p>
                        <p className={styles.text}>{event.what}</p>
                        {
                            event.when && 
                            <div className={styles.when}>{event.when}</div>
                        }
                    </div>
                </div>
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
