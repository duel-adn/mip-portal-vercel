/**
    (C) Duel srl 2021.

    API informazioni trasporto pubblico.

    Revision history

    | Data       | Autore | Descrizione 
    | ---------- | ------ | ----------------------------------- |
    | 2021/08/10 | Duel   | Prima versione                      |
*/

import { translateLocalDateTime } from "../../lib/MIPi18N"

/***
 * Ritorna i dati di mobilità
 * 
 * context: contesto passato da NextJS (https://nextjs.org/docs/basic-features/data-fetching)
 */

export async function mipFetchMobilityNewsData({locale}) {
    try {
        const res = await fetch(process.env.MIP_NEWS_URL)
        const news = await res.json()
        console.log(`${process.env.MIP_NEWS_URL} (${news.length})`)
        return news.map(({ id, validitystart, validityend, ...other }) => {
            return {
                id: parseInt(id),
                validitystart: validitystart ? translateLocalDateTime(locale, new Date(validitystart)) : null,
                validityend: validityend ? translateLocalDateTime(locale, new Date(validityend)) : null,
                ...other
            }
        })
    } catch (exc) {
        console.log(exc)
    }
    return []
}