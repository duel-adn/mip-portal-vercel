/**
    (C) Duel srl 2021.

    Card per la visualizzaizione di dati meteo di una città.

    Revision history

    | Data       | Autore | Descrizione 
    | ---------- | ------ | ----------------------------------- |
    | 2021/08/10 | Duel   | Prima versione                      |
*/
import styles from './MIPWeather.module.scss';

export default function MIPWeatherCard(props) {
    return (
        <div className={styles.card}>
            <h5>{props.province}</h5>
            {
                props.data.map((daily) => 
                    <p key={daily.date} style={{backgroundImage: `url(/weather-icons/${daily.code}.svg)`}}>{daily.date}</p>
                )
            }
        </div>
    )
}