/**
    (C) Duel srl 2021.

    API Acquisizione eventi di trasporto pubblico.

    Revision history

    | Data       | Autore | Descrizione 
    | ---------- | ------ | ----------------------------------- |
    | 2021/08/10 | Duel   | Prima versione                      |
*/

// TODO: Sportare in utility

function showDate(text) {
    const theDate = new Date(text)
    return theDate.toLocaleDateString('it') || ''
}

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
        return news.map(({ validitystart, ...other }) => {
            return {
                validitystart: showDate(validitystart),
                ...other
            }
        })
    } catch (exc) {
        console.log(exc)
    }
    return []
}