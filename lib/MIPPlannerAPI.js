/**
    (C) Duel srl 2021.

    API per il calcolo del percorso.

    Revision history

    | Data       | Autore | Descrizione 
    | ---------- | ------ | ----------------------------------- |
    | 2021/08/10 | Duel   | Prima versione                      |
*/

import { MIPContext, mipCreateError, mipFetch } from "./MIPUtility"
import { convertPlanResponse } from "./MIPOTPPlanConverter"
import { translatePlanResponse } from "./MIPPlanTranslator"

export const MIPPlannerError = {
    REV_GEOCODE_ERROR: "ReverseGeocodeError",
    REV_GEOCODE_NO_LOCATION: "ReverseGeocodeNoLocation",
    POSITION_NOT_SUPPORTED: "PositionNotSupporrted",
    POSITION_PERMISSION_DENIED: "PositionPermissionDenied",
    POSITION_NOT_AVAILABLE: "PositionNotAvailable",
    POSITION_TIMEOUT: "PositionTimeout",
    POSITION_UNKNOWN_ERROR: "PositionUnknownError"
}

/**
 * Modalità di trasporto da usare per il calcolo del percorso
 */
export const MIPPlanMode = {
    vehicle: 'CAR',
    transit: 'TRANSIT,WALK',
    bicycle: 'BICYCLE',
    walk: 'WALK'
}

/*
    Coefficienti da usare per l'otttimizzazione del calcolo del 
    percorso in bici.
*/
export const MIPBikeOptions = {
    safe: {
        optimize: "TRIANGLE",
        triangleSafetyFactor: .7,
        triangleSlopeFactor: .2,
        triangleTimeFactor: .1
    },
    easy: {
        optimize: "TRIANGLE",
        triangleSafetyFactor: .4,
        triangleSlopeFactor: .5,
        triangleTimeFactor: .1
    },
    fast: {
        optimize: "TRIANGLE",
        triangleSafetyFactor: .3,
        triangleSlopeFactor: .1,
        triangleTimeFactor: .6
    },
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
            return processGeocodeResponse(response)
        }
    }
    return []
}

/**
 * Geocodifica inversa tramite le API di Pelias
 * @param {String} lang codice lingua
 * @param {Number} longitude longitudine WGS84 
 * @param {Number} latitude latitudine WGS84
 * @returns la risposta del geocoder trasformata da processGeocodeResponse
 */
export async function mipReverseGeocode(lang, longitude, latitude) {
    lang = lang ?? 'it'
    const response = await mipFetch(process.env.NEXT_PUBLIC_REVERSE_GEOCODE_URL, {
        'lang': lang, 'point.lat': latitude, 'point.lon': longitude})
    return processGeocodeResponse(response)
}

export function mipGetUserPosition(lang, callback) {
    if (navigator?.geolocation) {
        navigator.geolocation.getCurrentPosition(
            pos => processUserPositionResponse(lang, pos, callback),
            error => processUserPositionError(error, callback),
            {
                enableHighAccuracy: true,
                maximumAge: 60000,
                timeout: 5000
            }
        )
    } else {
        callback(mipCreateError(MIPContext.USR_POSITION, MIPPlannerError.POSITION_NOT_SUPPORTED, "Il browser non permette di determinare la posizione"))
    }
}

export function mipPathSearchQuery(lang, fromLocation, fromCoordinates,
    toLocation, toCoordinates,
    mode, startDate, bikeOptions,
    intermediateStops) {
    const fromLocationString = fromLocation
    const fromPlace = `${fromLocationString}::${fromCoordinates.lat},${fromCoordinates.lng}`
    const toLocationString = toLocation
    const toPlace = `${toLocationString}::${toCoordinates.lat},${toCoordinates.lng}`
    const departOpts = startDate ? {
        'arriveBy': false,
        'date': `${startDate.getUTCFullYear()}-${startDate.getUTCMonth()}-${startDate.getUTCDate()}`,
        'time': `${startDate.getUTCHours()}:${startDate.getUTCMinutes()}`
    } : {}
    const bikeOpts = mode == MIPPlanMode.bicycle ? MIPBikeOptions[bikeOptions] : {}
    return {
        'fromPlace': encodeURI(fromPlace),//.replace(' ', '+')),
        'toPlace': encodeURI(toPlace), //.replace(' ', '+')),
        'mode': encodeURI(mode || 'CAR'),
        'maxWalkDistance': 2000,
        'locale': lang,
        ...departOpts,
        ...bikeOpts,
        'showIntermediateStops': intermediateStops ?? false
    }
}

export async function mipPathSearch(lang, fromLocation, fromCoordinates,
    toLocation, toCoordinates,
    mode, startDate, bikeOptions,
    intermediateStops) {
    const fromLocationString = fromLocation
    const fromPlace = `${fromLocationString}::${fromCoordinates.lat},${fromCoordinates.lng}`
    const toLocationString = toLocation
    const toPlace = `${toLocationString}::${toCoordinates.lat},${toCoordinates.lng}`
    const departOpts = startDate ? {
        'arriveBy': false,
        'date': `${startDate.getUTCFullYear()}-${startDate.getUTCMonth() + 1}-${startDate.getUTCDate()}`,
        'time': `${startDate.getUTCHours()}:${startDate.getUTCMinutes()}`
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

/**
 * Funzione interna che analizza le risposte di Pelias
 * @param {Object} response risposta ritornata da Pelias
 * @returns on oggetto errore o un oggetto contenente un array di locations
 */
function processGeocodeResponse(response, query) {
    let processedResponse = response
    if (!(response?.error)) {
        if (response?.errors) {
            // la rsipsta contiene errori
            processedResponse = mipCreateError(
                MIPContext.GEOCODE,
                MIPPlannerError.REV_GEOCODE_ERROR,
                response?.errors.join("\n").trim())
        } else {
            processedResponse = ({
                input: query ?? null,
                locations: response.features.map(feature => ({
                    id: feature.properties.id,
                    name: feature.properties.name ?? null,
                    locality: feature.properties.locality ?? feature.properties.localadmin,
                    label: feature.properties.label ?? null,
                    value: feature.properties.id,
                    coordinates: {
                        lat: feature.geometry.coordinates[1],
                        lng: feature.geometry.coordinates[0],
                    }
                })) ?? []
            })
        }
    }
    console.log(processedResponse)
    return processedResponse
}

function processUserPositionError(error, callback) {
    let errorCode = MIPPlannerError.REV_GEOCODE_ERROR
    switch (error.code) {
        case error.PERMISSION_DENIED:
            errorCode = MIPPlannerError.POSITION_PERMISSION_DENIED
            break;
        case error.POSITION_UNAVAILABLE:
            errorCode = MIPPlannerError.POSITION_NOT_AVAILABLE
            break;
        case error.TIMEOUT:
            errorCode = MIPPlannerError.POSITION_TIMEOUT
            break;
        case error.UNKNOWN_ERROR:
            errorCode = MIPPlannerError.POSITION_UNKNOWN_ERROR
            break;
        default:
            break
    }
    callback(mipCreateError(MIPContext.USR_POSITION, errorCode, "Impossibile stabilire la posizione dell'utente"))
}

function processUserPositionResponse(lang, position, callback) {
    const address = mipReverseGeocode(lang, position.coords.longitude, position.coords.latitude)
    .then(address => callback(address))
    .catch(error => callback(mipCreateError(MIPContext.GEOCODE, MIPPlannerError.REV_GEOCODE_ERROR, error)))
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
    "POSITION_NOT_ACCESSIBLE": "Una o entrambe le località non sono accessibili",
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

