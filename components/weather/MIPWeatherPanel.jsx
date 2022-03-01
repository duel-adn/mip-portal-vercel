/**
    (C) Duel srl 2021.

    Pannello per la visualizzazione dei dati meteo.

    Revision history

    | Data       | Autore | Descrizione 
    | ---------- | ------ | ----------------------------------- |
    | 2021/08/10 | Duel   | Prima versione                      |
*/

import styles from './MIPWeather.module.scss';

import useTranslation from 'next-translate/useTranslation'

function MIPWeatherCard(props) {
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

export default function MIPWeatherPanel(props) {
    const { t, lang } = useTranslation('common')
    return (
        <div className={`${props.className || ""} ${styles.weather_panel}`}>
            <div className={styles.title_container}>
                <h4>{t("WeatherConditions")}</h4>
                <a href="https://www.arpa.piemonte.it/rischi_naturali/snippets_arpa/meteo/" rel="noopener noreferrer">{t("ArpaPiemonte")}</a>
            </div>
            {props.weatherData?.length === 0 ?
                <div className={styles.card_list_container}>{t("WeatherCondError")}</div>
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
