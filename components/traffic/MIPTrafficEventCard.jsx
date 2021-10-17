import styles from './MIPTraffic.module.scss'

export default function MIPTrafficEventCard(props) {
    const className = `${props.className || ''} ${styles.traffic_event_card}`
    const compact = props.compact === undefined ? false : props.compact
    const event = props.event
    return (
        <div className={className}>
        {compact ?
            <div>
                <p className={styles.title}
                    style={{ 'backgroundImage': 'url("/icons/car-black.svg")' }}>{event.road}</p>
                <div className={styles.container}>
                    <p className={styles.text}>{event.what}</p>
                    <p className={styles.text}>{event.where}</p>
                </div>
            </div>
            :
            <div>
                <p className={styles.title} style={{ 'backgroundImage': 'url("/icons/car-black.svg")' }}>{event.road}</p>
                <div className={styles.container}>
                    <p className={styles.where}>{event.where}</p>
                    <p className={styles.text}>{event.what}</p>
                    {
                        event.when &&
                        <div className={styles.when}>{event.when}</div>
                    }
                </div>
            </div>
        }
        </div>
    )
}