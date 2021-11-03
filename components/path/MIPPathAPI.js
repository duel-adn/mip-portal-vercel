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

    const response = await mipFetch(
        process.env.NEXT_PUBLIC_MIP_PATH_PLAN_URL, {
        'fromPlace': encodeURI(fromPlace),
        'toPlace': encodeURI(toPlace),
        'mode': encodeURI(mode || 'CAR'),
        'maxWalkDistance': 2000,
        'locale': lang,
    })

    return translateOTPResponse(response)
}

function translateOTPResponse(response) {
    console.log(response)
    // Check the error
    if (response.error) {
        return translateOTPError(response.error)
    }
    return translateOTPPlan(response.plan)
}

const INVALID_LEG_RESPONSE = "Risposta non valida dal server - Tratta non valida"
const NO_PLAN_RESPONSE = "Risposta non valida dal server - Nessun piano"
const INVALID_PLACE_RESPONSE = "Risposta non valida dal server - località non valida"
const INVALID_ERROR_RESPONSE = "Risposta non valida dal server - formato del messaggio di errore"
const INVALID_ITINERARY_RESPONSE = "Risposta non valida dal server - itinerario non valido"
const INVALID_ITINERARIES_RESPONSE = "Risposta non valida dal server - itinerari non validi"

function translateOTPPlan(plan) {
    try {
        if (!plan) {
            throw NO_PLAN_RESPONSE
        }
        const fromPlace = translateOTPPlace(plan.from);
        const toPlace = translateOTPPlace(plan.to);
        const itineraries = translateOTPItineraries(plan.itineraries)
        return {
            from: fromPlace,
            to: toPlace,
            itineraries: itineraries
        }
    } catch (error) {
        console.log(error)
        return {
            error: {
                message: error
            }
        }
    }
}

function translateOTPPlace(place) {
    if (!place) {
        //throw INVALID_PLACE_RESPONSE
    }
    return place
}
function translateOTPError(error) {
    if (!error) {
        throw INVALID_ERROR_RESPONSE;
    }

    return { error }
}

function translateOTPItineraries(itineraries) {
    if (!itineraries) {
        throw INVALID_ITINERARIES_RESPONSE;
    }
    return itineraries.map(translateOTPItinerary)
}

function translateOTPItinerary(itinerary) {
    if (!itinerary) {
        throw INVALID_ITINERARY_RESPONSE;
    }
    return {
        duration_s: itinerary.duration || 0,            // 	Duration of the trip on this itinerary, in seconds.
        startTime: new Date(itinerary.startTime),       // Time that the trip departs.
        endTime: new Date(itinerary.endTime),           // Time that the trip arrives.
        walkTime: itinerary.walkTime,	                // How much time is spent walking, in seconds.
        walkLimitExceeded: itinerary.walkLimitExceeded, // Indicates that the walk limit distance has been exceeded
        walkDistance: itinerary.walkDistance,           // How far the user has to walk, in meters.
        transitTime: itinerary.transitTime,             // How much time is spent on transit, in seconds.
        waitingTime: itinerary.waitingTime,             // How much time is spent waiting for transit to arrive, in seconds.
        elevationLost: itinerary.elevationLost,         // How much elevation is lost, over the course of the trip, in meters.
        elevationGained: itinerary.elevationGained,     // How much elevation is gained, in total, over the course of the trip, in meters.
        tooSloped: itinerary.tooSloped,	                // This itinerary has a greater slope than the user requested
        transfers: itinerary.transfers,                 // The number of transfers this trip has.
        //fare: itinerary.fare,                         // The cost of this trip
        legs: translateOTPLegs(itinerary.legs),          // A list of Legs.
    }
}

function translateOTPLegs(legs) {
    if (!legs) {
        throw INVALID_LEG_RESPONSE;
    }
    return legs.map(translateOTPLeg)
}

// see: http://dev.opentripplanner.org/apidoc/1.0.0/json_Leg.html
function translateOTPLeg(leg) {
    if (!leg) {
        throw INVALID_LEG_RESPONSE;
    }
    return {
        startTime: new Date(leg.startTime),             // The date and time this leg begins.
        endTime: new Date(leg.endTime),                 // The date and time this leg ends.
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
        throw INVALID_STEP_RESPONSE;
    }
    return steps.map(translateOTPStep)
}

// http://dev.opentripplanner.org/apidoc/1.0.0/json_WalkStep.html
function translateOTPStep(step) {
    if (!step) {
        throw INVALID_STEP_RESPONSE;
    }
    return {
        distance_m: step.distance,                      // The distance in meters that this step takes.
        relativeDirection: translateOTPRelativeDirection(step.relativeDirection),      // The relative direction of this step.
        absoluteDirection: translateOTPAbsoluteDirection(step.absoluteDirection),   // The absolute direction of this step.
        streetName: step.bogusName ? null : step.streetName, // the name of the street
        exitName: step.exitName,                        //	When exiting a highway or traffic circle, the exit name/number.
        stayOn: step.stayOn,	                        // Indicates whether or not a street changes direction at an intersection.
        isArea: step.area,                              // This step is on an open area, such as a plaza or train platform, and thus the directions should say something like "cross"
        coordinates_xy: [step.lon, step.lat],           // Coordinate del punto
        instructions: generateOTPInstruction(step),
        icon: generateOTPIcon(step.relativeDirection)
    }
}

function generateOTPInstruction(step) {
    if (!step.streetName) {
        switch (step.relativeDirection) {
            case "DEPART":   return "partenza"
            case "CONTINUE": return `continua per ${step.distance} metri`
            default: return translateOTPRelativeDirection(step.relativeDirection)
        }
    }
    let instruction = null
    switch (step.relativeDirection) {
        case "DEPART":      instruction =  `partenza da ${step.streetName}`; break
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
        case "DEPART":   return "partenza"
        case "CONTINUE": return "continua"
        case "SLIGHTLY_LEFT": return "gira leggermente a sinistra"
        case "LEFT"	: return "gira a sinistra"
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
        case "DEPART":   return "departure"
        case "CONTINUE": return "continue"
        case "SLIGHTLY_LEFT": return "slightly-left"
        case "LEFT"	: return "left"
        case "HARD_LEFT": return "hard-left"	
        case "SLIGHTLY_RIGHT": return "slightly-right"
        case "RIGHT": return "right"
        case "HARD_RIGHT": return "hard-right"
        case "CIRCLE_CLOCKWISE": return "circel-cw"
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
        case "NORTH":   return "nord"
        case "NORTHEAST": return "nord-est"	
        case "EAST"	: return "est"
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