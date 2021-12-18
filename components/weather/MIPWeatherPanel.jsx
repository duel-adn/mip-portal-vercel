/**
    (C) Duel srl 2021.

    Pannello per la visualizzazione dei dati meteo.

    Revision history

    | Data       | Autore | Descrizione 
    | ---------- | ------ | ----------------------------------- |
    | 2021/08/10 | Duel   | Prima versione                      |
*/

import styles from './MIPWeather.module.scss';
import MIPWeatherCard from './MIPWeatherCard';

export default function MIPWeatherPanel(props) {
    return (
        <div className={`${props.className || ""} ${styles.weather_panel}`}>
            <div className={styles.title_container}>
                <h4>Previsioni meteo</h4>
                <p>In collaborazione con Arpa Piemonte</p>
            </div>
            {props.weatherData?.length === 0 ?
                <div className={styles.card_list_container}>Previsioni meteo non disponibili. Attendere qualche minuto e riprovare</div>
                :
                <div className={styles.card_list_container}>
                    {
                        props.weatherData.map((data, idx) =>
                            <MIPWeatherCard key={idx} province={data.prov} data={data.data} />
                        )
                    }
                </div>
            }
        </div>
    )
}
