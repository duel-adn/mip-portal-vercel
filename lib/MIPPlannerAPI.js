/**
    (C) Duel srl 2021.

    API per il calcolo del percorso.

    Revision history

    | Data       | Autore | Descrizione 
    | ---------- | ------ | ----------------------------------- |
    | 2021/08/10 | Duel   | Prima versione                      |
*/

import { MIPContext, mipFetch } from "./MIPUtility"
import { mipCreateError, MIPErrorCode } from "./MIPErrorHandling"
import { convertPlanResponse } from "./MIPOTPPlanConverter"

/**
 * Modalità di trasporto da usare per il calcolo del percorso
 */
export const MIPPlanMode = {
    VEHICLE: "Vehicle",
    TRANSIT: "Transit",
    BICYCLE: "Bicycle",
    WALK: "Walk"
}

export function mip2OtpMode(mode) {
    let otpMode = 'CAR'
    switch (mode) {
        case MIPPlanMode.TRANSIT:
            otpMode= 'TRANSIT,WALK'
            break
        case MIPPlanMode.BICYCLE:
            otpMode= 'BICYCLE'
            break
        case MIPPlanMode.WALK:
            otpMode= 'WALK'
            break
        default:
    }
    return otpMode
}

export function otp2MipMode(mode) {
    let mipMode = MIPPlanMode.TRANSIT
    switch (mode) {
        case 'BICYCLE':
            mipMode = MIPPlanMode.BICYCLE
            break
        case 'CAR':
            mipMode = MIPPlanMode.VEHICLE
            break
        case 'WALK':
            mipMode = MIPPlanMode.WALK
            break
        default:
    }
    return mipMode
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
        callback(mipCreateError(MIPErrorCode.MIP_POSITION_NOT_SUPPORTED, null, "Il browser non permette di determinare la posizione"))
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
    const bikeOpts = mode == MIPPlanMode.BICYCLE ? MIPBikeOptions[bikeOptions] : {}
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
    const bikeOpts = mode == MIPPlanMode.BICYCLE ? MIPBikeOptions[bikeOptions] : {}
    const response = await mipFetch(
        '/api/plan', {
        'fromPlace': encodeURI(fromPlace.replace(' ', '+')),
        'toPlace': encodeURI(toPlace.replace(' ', '+')),
        'mode': encodeURI(mip2OtpMode(mode) || 'CAR'),
        'maxWalkDistance': 2000,
        'locale': lang,
        ...departOpts,
        ...bikeOpts,
        'showIntermediateStops': intermediateStops ?? false
    })

    const convertedPlan = convertPlanResponse(mode, response)
    return convertedPlan // translatePlanResponse('it', convertedPlan)
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
            // la risposta contiene errori
            processedResponse = mipCreateError(
                MIPErrorCode.MIP_REV_GEOCODE_ERROR, null,
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
    let errorCode = MIPErrorCode.MIP_REV_GEOCODE_ERROR
    switch (error.code) {
        case error.PERMISSION_DENIED:
            errorCode = MIPErrorCode.MIP_POS_DENIED
            break;
        case error.POSITION_UNAVAILABLE:
            errorCode = MIPErrorCode.MIP_POS_UNAVAILABLE
            break;
        case error.TIMEOUT:
            errorCode = MIPErrorCode.MIP_POS_TIMEOUT
            break;
        case error.UNKNOWN_ERROR:
            errorCode = MIPErrorCode.MIP_POS_UNKNOWN
            break;
        default:
            break
    }
    callback(mipCreateError(errorCode, `${error.code}`, "Impossibile stabilire la posizione dell'utente"))
}

function processUserPositionResponse(lang, position, callback) {
    const address = mipReverseGeocode(lang, position.coords.longitude, position.coords.latitude)
    .then(address => callback(address))
    .catch(error => callback(mipCreateError(MIPContext.GEOCODE, MIPErrorCode.MIP_REV_GEOCODE_ERROR, error)))
}
