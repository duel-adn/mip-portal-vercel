/**
    (C) Duel srl 2021.

    API per il calcolo del percorso.

    Revision history

    | Data       | Autore | Descrizione 
    | ---------- | ------ | ----------------------------------- |
    | 2021/08/10 | Duel   | Prima versione                      |
*/

import { mipFetch } from "../../lib/MIPUtility"
import {convertPlanResponse} from "../../lib/MIPOTPPlanConverter"
import {translatePlanResponse} from "../../lib/MIPPlanTranslator"

export const MIPPlanMode = {
    vehicle: 'CAR',
    transit: 'TRANSIT,WALK',
    bicycle: 'BICYCLE',
    walk: 'WALK'
}

/*
    L'ordine è: triangleSafetyFactor, triangleSlopeFactor, triangleTimeFactor
*/
export const MIPBikeOptions = {
    safe: { triangleSafetyFactor: .7, triangleSlopeFacto: .2,triangleTimeFactor: .1 },
    easy: { triangleSafetyFactor: .4, triangleSlopeFacto: .5,triangleTimeFactor: .1 },
    fast: { triangleSafetyFactor: .3, triangleSlopeFacto: .1,triangleTimeFactor: .6 },
}

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
                '/api/autocomplete', {
                'lang': lang,
                'text': encodeURIComponent(searchString)
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

export async function mipPathSearch(lang, fromLocation, fromCoordinates, 
    toLocation, toCoordinates, 
    mode, startDate, bikeOptions, 
    intermediateStops) {
    const fromLocationString = fromLocation.toLowerCase()
    const fromPlace = `${fromLocationString}::${fromCoordinates[1]},${fromCoordinates[0]}`
    const toLocationString = toLocation.toLowerCase()
    const toPlace = `${toLocationString}::${toCoordinates[1]},${toCoordinates[0]}`
    const departOpts = startDate ? {
        'arriveBy': false,
        'date': new Date(startDate).toISOString()
    } : {}
    const bikeOpts = mode == MIPPlanMode.bicycle ? MIPBikeOptions[bikeOptions] : {}
    const response = await mipFetch(
        '/api/plan', {
        'fromPlace': encodeURI(fromPlace.replace(' ', '+')),
        'toPlace': encodeURI(toPlace.replace(' ', '+')),
        'mode': encodeURI(mode || 'CAR'),
        'maxWalkDistance': 2000,
        'locale': lang,
        ...departOpts,
        ...bikeOpts,
        'showIntermediateStops': intermediateStops ?? false
    })

    const convertedPlan = convertPlanResponse(mode, response)
    return translatePlanResponse('it', convertedPlan)
}


// http://dev.opentripplanner.org/apidoc/1.3.0/json_Message.html
const Errors = {
    "DL_UNKNOWN_ERROR": "Errore sconosciuto",
    "PLAN_OK": "Nessun errore",
    "SYSTEM_ERROR": "Errore di sistema",
    "GRAPH_UNAVAILABLE": "I dati per la ricerca non sono disponibili",
    "OUTSIDE_BOUNDS": "Le località si trovano al di fuori dell'area coperta dal servizio",
    "PATH_NOT_FOUND": "Non è stato possibile trovare un percorso con le caratteristiche selezionate",
    "NO_TRANSIT_TIMES": "Le informazioni sugli orari dei servizi di trasporto non sono disponibili",
    "REQUEST_TIMEOUT": "Il server non ha risposto",
    "BOGUS_PARAMETER": "Uno dei parametri inviati non è valido",
    "GEOCODE_FROM_NOT_FOUND": "La località di partenza non è stata trovata",
    "GEOCODE_TO_NOT_FOUND": "La località di arrivo non è stata trovata",
    "TOO_CLOSE": "Le località richieste sono troppo vicine",
    "LOCATION_NOT_ACCESSIBLE": "Una o entrambe le località non sono accessibili",
    "GEOCODE_FROM_AMBIGUOUS": "La località di partenza è specificata in modo ambiguo",
    "GEOCODE_TO_AMBIGUOUS": "La località di arrivo è specificata in modo ambiguo",
    "UNDERSPECIFIED_TRIANGLE": "Errore interno: triangolo non specificato",
    "TRIANGLE_NOT_AFFINE": "Errore interno: il triangolo specificato non è affine",
    "TRIANGLE_OPTIMIZE_TYPE_NOT_SET": "Errore interno: il tipo di ottimizzazione del triangolo non è impostata",
    "TRIANGLE_VALUES_NOT_SET": "Errore interno: i valori del triangolo non sono impostati",
    "DL_INVALID_LEGS_RESPONSE": "Risposta non valida dal server - Non sono presenti tratte nel percorso",
    "DL_INVALID_LEG_RESPONSE": "Risposta non valida dal server - Tratta non valida",
    "DL_INVALID_STEPS_RESPONSE": "Risposta non valida dal server - Istruzioni non valide",
    "DL_INVALID_STEP_RESPONSE": "Risposta non valida dal server - Istruzione non valida",
    "DL_NO_PLAN_RESPONSE =": "Risposta non valida dal server - Nessun piano",
    "DL_INVALID_PLACE_RESPONSE": "Risposta non valida dal server - località non valida",
    "DL_INVALID_ERROR_RESPONSE": "Risposta non valida dal server - formato del messaggio di errore",
    "DL_INVALID_ITINERARY_RESPONSE": "Risposta non valida dal server - itinerario non valido",
    "DL_INVALID_ITINERARIES_RESPONSE": "Risposta non valida dal server - itinerari non validi",
}

