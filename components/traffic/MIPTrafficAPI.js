/**
    Duel S.p.A.

    API per accesso ai dati di traffico

    Revision history

    | Data       | Autore | Descrizione 
    | ---------- | ------ | ----------------------------------- |
    | 2021/08/10 | Duel   | Prima versione                      |
*/

/***
 * Ritorna i dati di traffico
 * 
 * context: contesto passato da NextJS (https://nextjs.org/docs/basic-features/data-fetching)
 */
export async function mipFetchTrafficEventData(context) {
    const res = await fetch(process.env.MIP_TRAFFIC_EVENT_URL)
    const events = await res.json()
    console.log(process.env.MIP_TRAFFIC_EVENT_URL + ' ' + events.length)
    return events
}

export function mipGetTrafficEventIconUrl(style) {
    return `/traffic-icons/ico-${style}.svg`
}