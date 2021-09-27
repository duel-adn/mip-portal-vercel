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


const proviceMap = {
    'AL': 'Alesssandria',
    'AT': 'Asti',
    'BI': 'Biella',
    'CN': 'Cuneo',
    'NO': 'Novara',
    'TO': 'Torino',
    'VB': 'Verbano C.O.',
    'VC': 'Vercelli'
}

export default function MIPWeatherPanel(props) {
    return (
        <div className={`${props.className || ""} ${styles.weather_panel}`}>
            <div className={styles.title_container}>
                <h4>Previsioni meteo</h4>
                <p>In collaborazione con Arpa Piemonte</p>
            </div>
            <div className={styles.card_list_container}>
                {
                    props.weatherData && props.weatherData.map((data, idx) =>
                        <MIPWeatherCard key={idx} province={data.prov} data={data.data} />
                    )
                }
            </div>
        </div>
    )
}

export async function fetchWeatherData() {
    const res = await fetch(process.env.MIP_WEATHER_URL)
    const rawData = await res.json()
    console.log(`${process.env.MIP_WEATHER_URL} ${rawData.length}`)
    const today = new Date()
    let tomorrow =  new Date()
    tomorrow.setDate(today.getDate() + 1)
    const weatherData = rawData.map(md => { return {
        prov: proviceMap[md.prov],
        data: [ 
            {
                date: today.toLocaleDateString('it', {weekday: 'short', day: 'numeric'}),
                icon: md.oggi.meteoImg,
                temperature: md.oggi.temperature,
            },
            {
                date: tomorrow.toLocaleDateString('it', {weekday: 'short', day: 'numeric'}),
                icon: md.domani.meteoImg,
                temperature: md.domani.temperature,
            }
        ]
    }})
    return weatherData
  }
  