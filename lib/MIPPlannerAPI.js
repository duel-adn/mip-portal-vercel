/**
    (C) Duel srl 2021.

    API per il calcolo del percorso.

    Revision history

    | Data       | Autore | Descrizione 
    | ---------- | ------ | ----------------------------------- |
    | 2021/08/10 | Duel   | Prima versione                      |
*/

import { mipFetch } from "./MIPUtility"
import { mipCreateError, MIPErrorCode } from "./MIPErrorHandling"
import { convertPlanResponse } from "./MIPOTPPlanConverter"
import { toISOLocalDate, toISOLocalTime } from "./MIPI18N"
import { mipCreateId } from './MIPUtility'

/** Plan colors */

export const MIPItineraryColors = ["#00B431", "#0061B2", "#DA3463", "#F9C900"]

/**
 * Data di partenza/arrivo
 */

export const MIPDateOption = {
    START_NOW: "StartNow",
    DEPART_AT: "DepartAt",
    ARRIVE_BY: "ArriveBy",
}

/**
 * Modalità di trasporto da usare per il calcolo del percorso
 */
export const MIPPlanMode = {
    VEHICLE: "Vehicle",
    TRANSIT: "Transit",
    BICYCLE: "Bicycle",
    WALK: "Walk"
}

/**
 * Converte da MIPPlanMode a opzioni OTP
 * @param {String} mode MIPPlanMode da convertire
 * @returns le opzioni da passare a OTP
 */
export function mip2OtpMode(mode) {
    let otpMode = 'CAR'
    switch (mode) {
        case MIPPlanMode.TRANSIT:
            otpMode = 'TRANSIT,WALK'
            break
        case MIPPlanMode.BICYCLE:
            otpMode = 'BICYCLE'
            break
        case MIPPlanMode.WALK:
            otpMode = 'WALK'
            break
        default:
    }
    return otpMode
}

/**
 * Converte da opzioni OTP a MIPPlanMode
 * @param {String} mode opzioni OTP
 * @returns l'istanza di MIPPlanMode più vicina
 */
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
        triangleSafetyFactor: .2,
        triangleSlopeFactor: .7,
        triangleTimeFactor: .1
    },
    fast: {
        optimize: "TRIANGLE",
        triangleSafetyFactor: .2,
        triangleSlopeFactor: .1,
        triangleTimeFactor: .7
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
                'text': searchString
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
        'lang': lang, 'point.lat': latitude, 'point.lon': longitude
    })
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

/**
 * Estrae nome e coordinate dalla località nella query OTP
 * @param {*} loc 
 * @returns 
 */
export function mipParseOtpLocation(loc, unknowm) {
    if (typeof loc !== 'string') {
        return null
    }
    const components = loc.split("::")
    if (components.length === 2) {
        const name = components[0].length > 0 ? components[0].replace("+", " ") : unknowm
        const coords = components[1].split(",")
        if (coords.length === 2) {
            const id = mipCreateId()
            return {
                id: id,
                value: id,
                label: name,
                name: name,
                coordinates: { lng: Number(coords[1]), lat: Number(coords[0]) }
            }
        }
    }
    return null
}

/**
 * Estrae le opzioni per il path bicicletta dalla query OTP
 * La funzione trova l'opzione più vicina a quelle previste da MIP
 * usando il prodotto scalare tra i vettori che rappresentano i pesi delle varie opzioni
 * @param {Object} query la quesry OTP
 */
export function mipOTPParseBicycleOptions(query) {
    let option = ['safe', 0]
    if (query) {
        const optimize = query.optimize
        if (optimize === "TRIANGLE") {
            const triangleSafetyFactor = parseFloat(query.triangleSafetyFactor)
            const triangleSlopeFactor = parseFloat(query.triangleSlopeFactor)
            const triangleTimeFactor = parseFloat(query.triangleTimeFactor)
            if ((triangleSafetyFactor >= 0) && (triangleSlopeFactor >= 0) && (triangleTimeFactor >= 0)) {
                option = Object.keys(MIPBikeOptions).reduce((mx, key) => {
                    const value = MIPBikeOptions[key]
                    const length = Math.max(1e-6, value.triangleSafetyFactor + value.triangleSlopeFactor + value.triangleTimeFactor)
                    const scalarProduct =
                        value.triangleSafetyFactor * triangleSafetyFactor +
                        value.triangleSlopeFactor * triangleSlopeFactor +
                        value.triangleTimeFactor * triangleTimeFactor
                    return scalarProduct / length > mx[1] ? [key, scalarProduct / length] : mx
                }, option)
            }
        }
    }
    return option[0]
}

/**
 * Crea una query per il planner OTP
 * @param {String} lang locale da usare per la risposta
 * @param {MIPPlanMode} mode modo del viaggio
 * @param {String} fromLocation nome località di partenza 
 * @param {Object} fromCoordinates coordinate punto di partenza
 * @param {String} toLocation nome località di arrivo
 * @param {Object} toCoordinates coordinate punto di arrivo
 * @param {MIPDateOption} planDateOptions opzioni data di parteza / arrivo
 * @param {Date} planDate data di partenza/arrivo
 * @param {Object} bikeOptions opzioni viaggio in bicicletta
 * @returns un oggetto con le opzioni per la query
 */
export function mipPathSearchQuery(lang, mode,
    fromLocation, fromCoordinates,
    toLocation, toCoordinates,
    planDateOptions, planDate, bikeOptions) {
    const fromLocationString = fromLocation
    const fromPlace = `${fromLocationString}::${fromCoordinates.lat},${fromCoordinates.lng}`
    const toLocationString = toLocation
    const toPlace = `${toLocationString}::${toCoordinates.lat},${toCoordinates.lng}`
    const departOpts = planDateOptions !== MIPDateOption.START_NOW ? {
        'arriveBy': planDateOptions === MIPDateOption.ARRIVE_BY,
        'date': toISOLocalDate(planDate),
        'time': toISOLocalTime(planDate, true)
    } : {}
    const bikeOpts = mode == MIPPlanMode.BICYCLE ? MIPBikeOptions[bikeOptions] : {}
    return {
        'mode': mip2OtpMode(mode),
        'fromPlace': fromPlace.replace(' ', '+'),
        'toPlace': toPlace.replace(' ', '+'),
        'maxWalkDistance': 2000,
        'locale': lang,
        ...departOpts,
        ...bikeOpts,
        'showIntermediateStops': mode === MIPPlanMode.TRANSIT
    }
}

/** 
 * Cerca il percorso mediante le API di OTP
 * 
 * @param {String} lang locale da usare per la risposta
 * @param {MIPPlanMode} mode modo del viaggio
 * @param {String} fromLocation nome località di partenza 
 * @param {Object} fromCoordinates coordinate punto di partenza
 * @param {String} toLocation nome località di arrivo
 * @param {Object} toCoordinates coordinate punto di arrivo
 * @param {MIPDateOption} planDateOptions opzioni data di parteza / arrivo
 * @param {Date} planDate data di partenza/arrivo
 * @param {Object} bikeOptions opzioni viaggio in bicicletta
 * @returns un oggetto con le opzioni per la query
*/
export async function mipPathSearch(lang, mode,
    fromLocation, fromCoordinates,
    toLocation, toCoordinates,
    planDateOptions, planDate, bikeOptions) {
    const queryOpt = mipPathSearchQuery(lang, mode,
        fromLocation, fromCoordinates,
        toLocation, toCoordinates,
        planDateOptions, planDate, bikeOptions)
    const response = await mipFetch('/api/plan', queryOpt)
    const convertedPlan = convertPlanResponse(mode, response)
    return convertedPlan
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
        .catch(error => callback(mipCreateError(MIPErrorCode.MIP_REV_GEOCODE_ERROR, error)))
}
