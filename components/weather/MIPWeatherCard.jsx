/**
    (C) Duel srl 2021.

    Card per la visualizzaizione di dati meteo di una città.

    Revision history

    | Data       | Autore | Descrizione 
    | ---------- | ------ | ----------------------------------- |
    | 2021/08/10 | Duel   | Prima versione                      |
*/
import styles from './MIPWeather.module.scss';

const styleMap = {
    'sunny': styles.sunny,
    'cloudy': styles.cloudy,
}

export default function MIPWeatherCard(props) {
    return (
        <div className={styles.card}>
            <h5>{props.province}</h5>
            {
                props.data.map((daily) => 
                    <p key={daily.date} 
                    className={styleMap[daily.icon] || styles.cloudy}>{daily.date}</p>
                )
            }
        </div>
    )
}