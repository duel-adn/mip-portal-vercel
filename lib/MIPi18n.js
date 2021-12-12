/**
    (C) Duel srl 2021.

    Utility per l'internazionalizzazione.

    Revision history

    | Data       | Autore | Descrizione 
    | ---------- | ------ | ----------------------------------- |
    | 2021/11/03 | Duel   | Prima versione                      |
*/

import { mipConcatenate } from "./MIPUtility"

// http://dev.opentripplanner.org/apidoc/1.3.0/json_Message.html
export const PlanErrors = {
    "it": {
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
        "DL_UNKNOWN_ERROR": "Errore sconosciuto"
    }
}

/**
 * Ritorna la traduzione di uno dei codici di errore 
 * generati dal path planner
 * @param {String} locale locale per la traduzione (default 'it')
 * @param {String} code codice di errore
 * @returns il messaggio di errore
 */
export function getPlanErrorMessage(locale, code) {
    locale = PlanErrors[locale] ? locale : 'it'
    return PlanErrors[locale][code] ?? "Errore imprevisto"
}

export function translateUnixDateTime(locale, unixTime) {
    return unixTime > 0 ? new Intl.DateTimeFormat(locale ?? 'it-IT',
        {
            dateStyle: 'medium',
            timeStyle: "short"
        }).format(unixTime ?? Date.now()) 
        : null
}

export function translateUnixTime(locale, unixTime) {
    return unixTime > 0 ? new Intl.DateTimeFormat(locale ?? 'it-IT',
        {
            timeStyle: "short"
        }).format(unixTime ?? Date.now())
        :null
}

export function translateDuration(locale, duration_s) {
    const minutes = Math.floor(duration_s / 60) % 60
    const hours = Math.floor(duration_s / 3600) % 24
    const days =  Math.floor(duration_s / 3600 / 24)
    const daysDesc = days > 0 ? 
        `${days} ${days > 1 ? "giorni" : "giorno"}` : null
    const hoursDesc = hours > 0 ? 
    `${hours} ${hours > 1 ? "ore" : "ora"}` : null
    const minDesc = minutes > 0 ? 
    `${minutes} min.` : null
    return mipConcatenate(daysDesc, hoursDesc, minDesc)
}
  
  export function translateDistance(locale, distance_m) {
    const meters = Math.floor(distance_m)
    const km = Math.floor(meters / 1000)
    return km == 0 ? meters + " m" : Math.round(meters/100)/10 + " Km"
}

