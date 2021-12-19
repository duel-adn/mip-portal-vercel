/**
    (C) Duel srl 2021.

    API informazioni trasporto pubblico.

    Revision history

    | Data       | Autore | Descrizione 
    | ---------- | ------ | ----------------------------------- |
    | 2021/08/10 | Duel   | Prima versione                      |
*/

/***
 * Ritorna i dati di mobilità
 * 
 * context: contesto passato da NextJS (https://nextjs.org/docs/basic-features/data-fetching)
 */

export async function mipFetchMobilityNewsData(context) {
    try {
        const res = await fetch(process.env.MIP_NEWS_URL)
        const news = await res.json()
        console.log(`${process.env.MIP_NEWS_URL} (${news.length})`)
        return news
    } catch (exc) {
        console.log(exc)
    }
    return []
}