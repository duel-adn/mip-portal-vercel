/**
    Duel S.p.A.

    API per accesso ai dati di traffico

    Revision history

    | Data       | Autore | Descrizione 
    | ---------- | ------ | ----------------------------------- |
    | 2021/08/10 | Duel   | Prima versione                      |
*/

function translateEventData(locale, event) {
    try {
        return {
            id: event.id,
            category: event.category, 
            style: event.style, 
            lat: event.lat, 
            lng: event.lng, 
            startDate: event.startDate ?? null,
            endDate: event.endDate ?? null,
            road: (locale == 'en' ? event.road : event.road) ?? null,
            where: (locale == 'en' ? event.where_en : event.where) ?? null,
            what: (locale == 'en' ? event.what_en : event.what) ?? null,
            when: (locale == 'en' ? event.when_en : event.when) ?? null,
        }
    } catch (exc) {
        console.log(exc)
    }
    return null
}

/***
 * Ritorna i dati di traffico
 * 
 * context: contesto passato da NextJS (https://nextjs.org/docs/basic-features/data-fetching)
 */
export async function mipFetchTrafficEventData({ locale }) {
    try {
        const res = await fetch(process.env.MIP_TRAFFIC_EVENT_URL)
        const events = await res.json()
        console.log(process.env.MIP_TRAFFIC_EVENT_URL + ' ' + events.length)
        const translatedEvents = events
            ?.map(e => translateEventData(locale, e))
            ?.filter(e => e)

        return translatedEvents
    }
    catch (exc) {
        console.log(exc)
    }
    return []
}

export function mipGetTrafficEventIconUrl(style) {
    return `/traffic-icons/ico-${style}.svg`
}