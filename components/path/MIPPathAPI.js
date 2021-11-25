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

export async function mipPathSearch(lang, fromLocation, fromCoordinates, toLocation, toCoordinates, mode) {
    const fromLocationString = fromLocation.toLowerCase()
    const fromPlace = `${fromLocationString}::${fromCoordinates[1]},${fromCoordinates[0]}`
    const toLocationString = toLocation.toLowerCase()
    const toPlace = `${toLocationString}::${toCoordinates[1]},${toCoordinates[0]}`
    const dateTime = new Date(Date.now() + 5 * 60000)
    const response = await mipFetch(
        process.env.NEXT_PUBLIC_MIP_PATH_PLAN_URL, {
        'fromPlace': encodeURI(fromPlace.replace(' ', '+')),
        'toPlace': encodeURI(toPlace.replace(' ', '+')),
        'mode': encodeURI(mode || 'CAR'),
        'maxWalkDistance': 2000,
        'locale': lang,
    })

    return convertPlanResponse(response)
}

const NO_PLAN_RESPONSE = { id: 10000, message: "DL_NO_PLAN_RESPONSE" }
const INVALID_PLACE_RESPONSE = { id: 1001, message: "DL_INVALID_PLACE_RESPONSE" }
const INVALID_ITINERARY_RESPONSE = { id: 1002, message: "DL_INVALID_ITINERARY_RESPONSE" }
const INVALID_ITINERARIES_RESPONSE = { id: 1003, message: "DL_INVALID_ITINERARIES_RESPONSE" }
const INVALID_LEGS_RESPONSE = { id: 1004, message: "DL_INVALID_LEGS_RESPONSE" }
const INVALID_LEG_RESPONSE = { id: 1005, message: "DL_INVALID_LEG_RESPONSE" }
const INVALID_STEPS_RESPONSE = { id: 1006, message: "DL_INVALID_STEPS_RESPONSE" }
const INVALID_STEP_RESPONSE = { id: 1007, message: "DL_INVALID_STEP_RESPONSE" }

function translateOTPPlan(plan) {
    let convertedPlan = null
    try {
        if (!plan) {
            throw NO_PLAN_RESPONSE
        }
        return {
            plan: {
                mode: translatePlanMode(plan),
                from: translateOTPPlace(plan.from),
                to: translateOTPPlace(plan.from),
                itineraries: translateOTPItineraries(plan.itineraries)
            }
        }
    } catch (error) {
        console.log(error)
        return translateOTPError({
            error: {
                message: error
            }
        })
    }
}

function translatePlanMode(plan) {
    const mode = plan?.requestParameters?.mode ?? 'CAR'
    // TODO: controllo del valode ritornato
    return mode
}

function translateOTPPlace(place) {
    if (!place) {
        throw INVALID_PLACE_RESPONSE
    }
    return {
        name: place.name,
        coords: [place.lon, place.lat],
    }
}

function translateOTPItineraries(itineraries) {
    if (!itineraries) {
        throw INVALID_ITINERARIES_RESPONSE;
    }
    return itineraries.map(translateOTPItinerary)
}

function translateOTPItinerary(itinerary, idx) {
    if (!itinerary) {
        throw INVALID_ITINERARY_RESPONSE;
    }
    console.log(itinerary)
    return {
        id: idx,
        startLocation: getStartLocation(itinerary),
        endLocation: getEndLocation(itinerary),
        duration_s: itinerary.duration ?? 0,            // 	Duration of the trip on this itinerary, in seconds.
        startTime: itinerary.startTime,       // Time that the trip departs.
        endTime: itinerary.endTime,           // Time that the trip arrives.
        walkTime_s: itinerary.walkTime,	                // How much time is spent walking, in seconds.
        walkLimitExceeded: itinerary.walkLimitExceeded, // Indicates that the walk limit distance has been exceeded
        walkDistance_m: itinerary.walkDistance,           // How far the user has to walk, in meters.
        totalDistance_m: getItineraryLength(itinerary.legs),
        transitTime: itinerary?.transitTime,             // How much time is spent on transit, in seconds.
        waitingTime: itinerary?.waitingTime,             // How much time is spent waiting for transit to arrive, in seconds.
        elevationLost: itinerary.elevationLost,         // How much elevation is lost, over the course of the trip, in meters.
        elevationGained: itinerary.elevationGained,     // How much elevation is gained, in total, over the course of the trip, in meters.
        tooSloped: itinerary.tooSloped,	                // This itinerary has a greater slope than the user requested
        transfers: itinerary.transfers,                 // The number of transfers this trip has.
        description: getItineraryDescription(itinerary),
        legs: translateOTPLegs(itinerary.legs),          // A list of Legs.
    }
}
function getItineraryLength(legs) {
    let length = 0;
    console.log('legs')
    console.log(legs)
    switch (legs?.length ?? 0) {
        case 0:
            break

        case 1:
            length = legs[0].distance
            break

        default:
            length = legs?.reduce((a, b) => (a?.distance ?? 0) + (b?.distance ?? 0), 0)
    }

    console.log(length)
    return length
}

function getItineraryDescription(itinerary) {
    const longestLeg = itinerary.legs.reduce((l1, l2) =>
        l1.distance > l2.distance ? l1 : l2)
    const longestStep = longestLeg.steps.reduce((s1, s2) =>
        s1.streetName && s1.distance > s2.distance ? s1 :
            (s2.streetName ? s2 : s1)
    )
    return longestStep.streetName
}

function getStartLocation(itinerary) {
    return translateOTPPlace(itinerary.legs[0].from)
}
function getEndLocation(itinerary) {
    return translateOTPPlace(itinerary.legs[itinerary.legs.length - 1].to)
}
function translateOTPLegs(legs) {
    if (!legs) {
        throw INVALID_LEGS_RESPONSE;
    }
    return legs.map(translateOTPLeg)
}

// see: http://dev.opentripplanner.org/apidoc/1.0.0/json_Leg.html
function translateOTPLeg(leg, idx) {
    if (!leg) {
        throw INVALID_LEG_RESPONSE;
    }
    switch (leg.mode) {
        case 'RAIL':
        case 'BUS':
            return translateTransitLeg(leg)
        case 'WALK':
        case 'CAR':
            break
        default:
            console.log('Unknown transport mode: ' + leg.mode)
    }
    return {
        id: idx,
        startTime: leg.startTime,             // The date and time this leg begins.
        endTime: leg.endTime,                 // The date and time this leg ends.
        duration_s: leg.duration,	                    // The leg's duration in seconds
        distance_m: leg.distance,                       // The distance traveled while traversing the leg in meters.
        mode: leg.mode,                                 // The mode (e.g., Walk) used when traversing this leg.
        route: leg.route,	                            // For transit legs, the route of the bus or train being used. For non-transit legs, the name of the street being traversed.
        routeType: translateRouteType(leg.routeType),
        from: translateOTPPlace(leg.from),              // The Place where the leg originates.
        to: translateOTPPlace(leg.to),                  // The Place where the leg begins.
        steps: translateOTPSteps(leg.steps),            // A series of turn by turn instructions used for walking, biking and driving.
    }
}

function translateTransitLeg(leg, idx) {
    if (!leg) {
        throw INVALID_LEG_RESPONSE;
    }
    return {
        id: idx,
        startTime: leg.startTime,             // The date and time this leg begins.
        endTime: leg.endTime,                 // The date and time this leg ends.
        duration_s: leg.duration,	                    // The leg's duration in seconds
        distance_m: leg.distance,                       // The distance traveled while traversing the leg in meters.
        mode: leg.mode,                                 // The mode (e.g., Walk) used when traversing this leg.
        route: leg.route,	                            // For transit legs, the route of the bus or train being used. For non-transit legs, the name of the street being traversed.
        routeType: translateRouteType(leg.routeType),
        from: translateOTPPlace(leg.from),              // The Place where the leg originates.
        to: translateOTPPlace(leg.to),                  // The Place where the leg begins.
        steps: translateOTPSteps(leg.steps),            // A series of turn by turn instructions used for walking, biking and driving.
    }
}

function translateOTPSteps(steps) {
    if (!steps) {
        throw INVALID_STEPS_RESPONSE;
    }
    return steps.map(translateOTPStep)
}

// http://dev.opentripplanner.org/apidoc/1.0.0/json_WalkStep.html
function translateOTPStep(step, idx) {
    if (!step) {
        throw INVALID_STEP_RESPONSE;
    }
    return {
        id: idx,
        distance_m: step.distance,                      // The distance in meters that this step takes.
        relativeDirection: translateOTPRelativeDirection(step.relativeDirection),      // The relative direction of this step.
        absoluteDirection: translateOTPAbsoluteDirection(step.absoluteDirection),   // The absolute direction of this step.
        streetName: step.bogusName ? null : step.streetName, // the name of the street
        exitName: step?.exitName ?? null,                        //	When exiting a highway or traffic circle, the exit name/number.
        stayOn: step.stayOn ?? false,	                        // Indicates whether or not a street changes direction at an intersection.
        isArea: step.area ?? false,                              // This step is on an open area, such as a plaza or train platform, and thus the directions should say something like "cross"
        coordinates_xy: [step.lon, step.lat],           // Coordinate del punto
        instruction: generateOTPInstruction(step),
        icon: generateOTPIcon(step.relativeDirection)
    }
}

function generateOTPInstruction(step) {
    if (!step.streetName) {
        switch (step.relativeDirection) {
            case "DEPART": return "partenza"
            case "CONTINUE": return `continua per ${step.distance} metri`
            default: return translateOTPRelativeDirection(step.relativeDirection)
        }
    }
    let instruction = null
    switch (step.relativeDirection) {
        case "DEPART": instruction = `partenza da ${step.streetName}`; break
        case "CONTINUE":
        case "UTURN_LEFT":
        case "UTURN_RIGHT":
            instruction = `${translateOTPRelativeDirection(step.relativeDirection)} su ${step.streetName}`; break
        case "SLIGHTLY_LEFT":
        case "LEFT":
        case "HARD_LEFT":
        case "SLIGHTLY_RIGHT":
        case "RIGHT":
        case "HARD_RIGHT":
        case "CIRCLE_CLOCKWISE":
        case "CIRCLE_COUNTERCLOCKWISE":
            instruction = `${translateOTPRelativeDirection(step.relativeDirection)} verso ${step.streetName}`; break
        default: instruction = `prendi ${step.streetName}`; break
    }
    if (step.exitName) {
        instruction = `${instruction} e prendi l'uscita ${step.exitName}`
    }
    return instruction
}

// http://dev.opentripplanner.org/apidoc/1.0.0/json_RelativeDirection.html
function translateOTPRelativeDirection(direction) {
    switch (direction) {
        case "DEPART": return "partenza"
        case "CONTINUE": return "continua"
        case "SLIGHTLY_LEFT": return "gira leggermente a sinistra"
        case "LEFT": return "gira a sinistra"
        case "HARD_LEFT": return "gira a sinistra"
        case "SLIGHTLY_RIGHT": return "gira leggermente a destra"
        case "RIGHT": return "gira a destra"
        case "HARD_RIGHT": return "gira a destra"
        case "CIRCLE_CLOCKWISE": return "gira in senso orario"
        case "CIRCLE_COUNTERCLOCKWISE": return "gira in senso antiorario"
        case "ELEVATOR": return "prendi l'ascensore"
        case "UTURN_LEFT": return "esegui un'inversione a U verso sinistra"
        case "UTURN_RIGHT": return "esegui un'inversione a U verso destra"
    }
    return "prendi"
}

// http://dev.opentripplanner.org/apidoc/1.0.0/json_RelativeDirection.html
function generateOTPIcon(direction) {
    switch (direction) {
        case "DEPART": return "departure"
        case "CONTINUE": return "continue"
        case "SLIGHTLY_LEFT": return "slightly-left"
        case "LEFT": return "left"
        case "HARD_LEFT": return "hard-left"
        case "SLIGHTLY_RIGHT": return "slightly-right"
        case "RIGHT": return "right"
        case "HARD_RIGHT": return "hard-right"
        case "CIRCLE_CLOCKWISE": return "circle-cw"
        case "CIRCLE_COUNTERCLOCKWISE": return "circle-ccw"
        case "ELEVATOR": return "elevator"
        case "UTURN_LEFT": return "left-uturn"
        case "UTURN_RIGHT": return "right-uturn"
    }
    return "continue"
}

// http://dev.opentripplanner.org/apidoc/1.0.0/json_AbsoluteDirection.html
function translateOTPAbsoluteDirection(direction) {
    switch (direction) {
        case "NORTH": return "nord"
        case "NORTHEAST": return "nord-est"
        case "EAST": return "est"
        case "SOUTHEAST": return "sud-est"
        case "SOUTH": return "sud"
        case "SOUTHWEST": return "sud-ovest"
        case "WEST": return "ovest"
        case "NORTHWEST": return "nord-ovest"
    }
    return null
}


// For transit legs, the type of the route. 
// Non transit -1 
// When 0-7: 0 Tram, 1 Subway, 2 Train, 3 Bus, 4 Ferry, 5 Cable Car, 6 Gondola, 7 Funicular 
// When equal or highter than 100, it is coded using the Hierarchical Vehicle Type (HVT) 
// codes from the European TPEG standard Also see http://groups.google.com/group/gtfs-changes/msg/ed917a69cf8c5bef
function translateRouteType(type) {
    switch (type) {
        case 0: return "Tram"
        case 1: return "Metropolitana"
        case 2: return "Treno"
        case 3: return "Bus"
        case 4: return "Traghetto"
        case 5: return "Tram"
        case 6: return "Gondola"
        case 6: return "Funicolare"
    }

    return null
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

export function translateUnixDateTime(locale, unixTime) {
    return new Intl.DateTimeFormat(locale ?? 'it-IT',
        {
            dateStyle: 'long',
            timeStyle: "short"
        }).format(unixTime ?? Date.now())
}

export function translateUnixTime(locale, unixTime) {
    return new Intl.DateTimeFormat(locale ?? 'it-IT',
        {
            timeStyle: "short"
        }).format(unixTime ?? Date.now())
}

export function translateDuration(s) {
    const hours = Math.floor(s / 3600)
    const min = Math.round((s % 3600) / 60)
    const sec = s % 60
    const hoursTr = ['ora', 'ore']
    if (hours <= 0) {
      return `${min} min. ${sec} s`
    } else if (min <= 0) {
      return `${sec} s`
    }
    return `${hours} ${hoursTr[Number(hours > 1)]} ${min} min.`
  }
  
  