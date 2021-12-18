/**
    Duel S.p.A.

    API per l'acquisizione dei dati meteo

    Revision history

    | Data       | Autore | Descrizione 
    | ---------- | ------ | ----------------------------------- |
    | 2021/08/10 | Duel   | Prima versione                      |
*/


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

/***
 * Ritorna i dati meteo
 * 
 * context: contesto passato da NextJS (https://nextjs.org/docs/basic-features/data-fetching)
 */

export async function mipFetchWeatherData() {
    try {
        const res = await fetch(process.env.MIP_WEATHER_URL)
        const rawData = await res.json()
        console.log(`${process.env.MIP_WEATHER_URL} ${rawData.length}`)
        const today = new Date()
        let tomorrow = new Date()
        tomorrow.setDate(today.getDate() + 1)
        const weatherData = rawData.map(md => {
            return {
                prov: proviceMap[md.prov],
                data: [
                    {
                        date: today.toLocaleDateString('it', { weekday: 'short', day: 'numeric' }),
                        icon: md.oggi.meteoImg,
                        temperature: md.oggi.temperature,
                        code: md.oggi.code
                    },
                    {
                        date: tomorrow.toLocaleDateString('it', { weekday: 'short', day: 'numeric' }),
                        icon: md.domani.meteoImg,
                        temperature: md.domani.temperature,
                        code: md.domani.code
                    }
                ]
            }
        })
        return weatherData
    } catch (exc) {
        console.log("Errore dal server previsioni " + exc)
    }
    return []
  }
