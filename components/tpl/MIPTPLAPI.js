/**
    (C) Duel srl 2021.

    API Acquisizione eventi di trasporto pubblico.

    Revision history

    | Data       | Autore | Descrizione 
    | ---------- | ------ | ----------------------------------- |
    | 2021/08/10 | Duel   | Prima versione                      |
*/

import { translateLocalDateTime } from "../../lib/MIPi18N"

/***
 * Ritorna i dati sul trasporto pubblico
 * 
 * context: contesto passato da NextJS (https://nextjs.org/docs/basic-features/data-fetching)
 */

export async function mipFetchPublicTransportData(context) {
    try {
        const res = await fetch(process.env.MIP_TPL_URL)
        const news = await res.json()
        console.log(`${process.env.MIP_TPL_URL} (${news.length})`)
        const mappedNews = news.map(({ validitystart, validityend, ...other }) => {
            return {
                validitystart: validitystart ? translateLocalDateTime(context.locale, new Date(validitystart)) : null,
                validityend: validityend ? translateLocalDateTime(context.locale, new Date(validityend)) : null,
                ...other
            }
        })
        return mappedNews
    } catch (exc) {
        console.log(exc)
    }
    return []
}

export async function mipFetchPublicTransportArticle(locale, newsId, maxNews) {
    try {
        const res = await fetch(process.env.MIP_TPL_URL)
        const news = await res.json()
        console.log(`${process.env.MIP_TPL_URL} (${news.length})`)
        const intId = parseInt(newsId)
        const mappedNews = news.map(({ id, validitystart, validityend, ...other }) => {
            return {
                id: parseInt(id),
                validitystart: validitystart ? translateLocalDateTime(locale, new Date(validitystart)) : null,
                validityend: validityend ? translateLocalDateTime(locale, new Date(validityend)) : null,
                ...other
            }
        })
        const filteredNews = mappedNews.filter(n => n.id === intId)
        const others = mappedNews.sort((n1, n2) =>  n1.id - n2.id)
            .filter(e => e.id !== intId)
            .slice(0, maxNews - 1)
        const validNews = {
            article: filteredNews[0],
            others: others
        }
        return validNews
    } catch (exc) {
        console.log(exc)
    }
    return []
}