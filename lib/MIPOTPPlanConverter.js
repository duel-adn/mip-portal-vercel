/**
    (C) Duel srl 2021.

    Traduzione multilingue del piano calcolaro dal sistema di 
    calcolo del percorso.

    Revision history

    | Data       | Autore | Descrizione 
    | ---------- | ------ | ----------------------------------- |
    | 2021/11/03 | Duel   | Prima versione                      |
*/

const MIPPlanError = {
    PLAN_OK: "Ok",
    UNKNOWN_ERROR: "UnknownError",
    FETCH_ERROR: "FetchError",
    SERVER_ERROR: "ServerError",
    UNKNOWN_SERVER_ERROR: "UnknownServerError",
    INV_RESP_FMT: "InvalidResponseFormat",
    INV_PLAN_FMT: "InvalidPlanFormat",
    INV_LOCATION_FMT: "InvalidItineraryFormat",
    INV_ITINERARY_FMT: "InvalidItineraryFormat",
    INV_LEG_FMT: "InvalidItineraryFormat",
    INV_STEP_FMT: "InvalidItineraryFormat",
}

/**
 * Crea un oggetto che contiene un piano con un codice di errore
 * 
 * @param {String} mipCode 
 * @param {String} code 
 * @returns 
 */
function createPlanError(mipCode, code, defaultMsg) {
    return {
        error: {
            mipErrorCode: mipCode,
            errorCode: code ?? -1,
            defaultMsg: defaultMsg ?? null
        }
    }
}

/**
 * Traduce un oggetto di tipo Response ritornato da OTP.
 * 
 * Riferimento:
 * http://dev.opentripplanner.org/apidoc/1.0.0/json_Response.html
 * 
 * @param {Object} planResponse 
 * 
 * @returns un oggetto contenente i dati da mostrare sulla GUI
 */
export function convertPlanResponse(planResponse) {
    let planTranslation = createPlanError(MIPPlanError.INV_RESP_FMT)
    try {
        if (planResponse?.fetchError) {
            planTranslation = createPlanError(MIPPlanError.FETCH_ERROR, 
                planResponse.fetchError?.statusCode ?? -1, 
                planResponse.fetchError?.errorMessage)
        } else if (planResponse?.error) {
            planTranslation = createPlanError(MIPPlanError.SERVER_ERROR, 
                planResponse.error?.message ?? -1)
        } else if (planResponse?.plan) {
            planTranslation = convertPlan('CAR', planResponse?.plan)
        }
    } catch (exc) {
        console.log(exc)
        planTranslation = createPlanError(MIPPlanError.INV_RESP_FMT)
    }
    return planTranslation
}

/**
 * Traduce un oggetto di tipo TripPlan ritornato da OTP
 * Riferimento:
 * http://dev.opentripplanner.org/apidoc/1.0.0/json_TripPlan.html
 * 
 * @param {String} mode modalità di trasporto
 * @param {Object} plan oggetto TripPlan
 * 
 * @returns un oggetto contenente i dati da mostrare sulla GUI
 */
function convertPlan(mode, plan) {
    let planTranslation = createPlanError(MIPPlanError.INV_PLAN_FMT)
    try {
        let translation = {
            mode: mode,
            startTime: plan?.date ?? Date.now(),
            startLocation: convertLocation(plan?.from),
            endLocation: convertLocation(plan?.to),
            itineraries: plan?.itineraries?.map((it, idx) => convertItinerary(idx, it))
        }
        planTranslation = {
            plan: translation
        }
    } catch (exc) {
        console.log(exc)
        planTranslation = createPlanError(MIPPlanError.INV_PLAN_FMT)
    }
    return planTranslation
}

/**
 * Traduce un oggetto di tipo Itinerary ritornato da OTP.
 * Riferimento:
 * http://dev.opentripplanner.org/apidoc/1.0.0/json_Itinerary.html
 * 
 * @param {Number} id id dell'itinerario
 * @param {Object} itinerary oggetto di tipo Itinerary
 * 
 * @returns un oggetto contenente i dati da mostrare sulla GUI o null in caso di itinerario non valido
 */
function convertItinerary(id, itinerary) {
    let convertedItinerary = null
    try {
        convertedItinerary = {
            id: id,
            startTime: itinerary?.startTime,
            endTime: itinerary?.endTime,
            duration_s: itinerary?.duration,
            legs: itinerary?.legs?.map((leg, idx) => convertLeg(idx, leg))
        }
        let distance_m = 0
        switch (convertedItinerary.legs.length) {
            case 0:
                console.log(`skipping itinerary ${id}: with no legs`)
                convertItinerary = null
                break
            case 1:
                distance_m = convertedItinerary.legs[0].distance_m
                break;
                
            default:
                distance_m = convertedItinerary.legs.reduce((l1, l2) => 
                    (l1?.distance_m ?? 0) + (l2?.distance_m ?? 0))
        }
        if (convertedItinerary) {
            convertedItinerary['distance_m'] = distance_m
        }
    } catch (exc) {
        console.log(exc)
        convertedItinerary = null
    }

    return convertedItinerary
}

/**
 * Traduce un oggetto di tipo Leg ritornato da OTP
 * Riferimento:
 * http://dev.opentripplanner.org/apidoc/1.0.0/json_Leg.html
 * 
 * @param {Number} id id della leg
 * @param {Object} leg oggetto di tipo Leg
 * 
 * @returns un oggetto contenente i dati da mostrare sulla GUI o null
 */
function convertLeg(id, leg) {
    let convertdLeg = null
    try {
        convertdLeg = {
            id: id,
            mode: leg?.mode,
            startTime: leg?.startTime ?? null,
            endTime: leg?.endTime ?? null,
            duration_s: leg?.duration ?? null,
            frequencyBased: leg.isNonExactFrequency ?? false,
            distance_m: leg?.distance ?? 0,
            encodedGeom: leg.legGeometry,
            steps: leg?.steps?.map((step, idx) => convertStep(idx, step))
        }
    } catch (exc) {
        console.log(exc)
        convertdLeg = null
    }

    return convertdLeg
}

/**
 * Traduce un oggetto di tipo WalkStep ritornato da OTP
 * Riferimento:
 * http://dev.opentripplanner.org/apidoc/1.0.0/json_WalkStep.html
 * 
 * @param {Number} id id dello step
 * @param {Object} leg oggetto di tipo WalkStep
 * 
 * @returns un oggetto contenente i dati da mostrare sulla GUI
 */
function convertStep(id, step) {
    let convertdStep = null
    try {
        convertdStep = {
            id: id,
            streetName: (step?.bogusName ? null : step?.streetName) ?? null,
            distance_må: step?.distance ?? 0,
            exit: step.exit ?? null,
            area: step?.area ?? false,
            stayOn: step?.stayOn ?? false,
            relativeDirection: step?.relativeDirection ?? null,
            absoluteDirection: step?.absoluteDirection ?? null,
            icon: convertIcon(step?.relativeDirection),
            latLon: [step?.lat, step?.lon], // controllare
        }
    } catch (exc) {
        console.log(exc)
        convertdStep = null
    }

    return convertdStep
}

/**
 * Traduce un oggetto di tipo Place di OTP
 * http://dev.opentripplanner.org/apidoc/1.0.0/json_Place.html
 * 
 * @param {Object} location oggetto di tipo Place di OTP o null
 */
function convertLocation(location) {
    let place = null
    try {
        place = {
            name: location?.name ?? null,
            latLon: [location?.lat, location?.lon], // controllare
            departure: location?.departure ?? 0,
            arrival: location?.arrival ?? 0,
        }
    } catch (exc) {
        console.log(exc)
        place = null
    }
    return place
}

// http://dev.opentripplanner.org/apidoc/1.0.0/json_RelativeDirection.html
function convertIcon(direction) {
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
        default:
    }
    return "continue"
}

