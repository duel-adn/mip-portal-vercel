/**
    (C) Duel srl 2021.

    API per il calcolo del percorso.

    Revision history

    | Data       | Autore | Descrizione 
    | ---------- | ------ | ----------------------------------- |
    | 2021/08/10 | Duel   | Prima versione                      |
*/

import { mipFetch } from "../../lib/MIPUtility"

/**
 * Interroga la API per l'auto completion degli indirizzi e ritorna 
 * un array di indirizzi coerente con la stringa di ricerca.
 * 
 * @param {string} lang lingua da usare per i risultati 
 * @param {string} searchString stringa di ricerca
 * @returns un oggetto di tipo Error o la lista degli indirizzi
 */
export async function mipPathAutocomplete(lang, searchString) {
    if (typeof searchString == 'string') {
        const reqLang = lang || 'IT'
        const reqString = searchString.toLowerCase().trim()
        if (reqString.length > 2) {
            const response = await mipFetch(
                process.env.NEXT_PUBLIC_MIP_AUTOCOMPLETE_URL, {
                'lang': lang,
                'text': reqString
            })
            return response instanceof Error ? response :
                response.features.map(feature => {
                    return {
                        input: searchString,
                        id: feature.properties.id,
                        name: feature.properties.label,
                        label: feature.properties.label,
                        value: feature.properties.id,
                        coordinates: feature.geometry.coordinates
                    }
                })
        }
    }
    return []
}