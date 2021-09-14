import styles from './TrafficPanels.module.scss'

export default function TrafficEventCard(props) {
    const evt = props.event
    return (
        <div className={`${props.className} ${styles.traffic_event_card}`}>
            <h4>{evt.road}</h4>
            <p className={styles.where}>{evt.where}</p>
            <p className={styles.what}>{evt.what}</p>
            {evt.when && <p className={styles.when}>{evt.when}</p>}
        </div>
    )
}