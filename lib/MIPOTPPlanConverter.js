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
 * @param {String} mipCode codice errore specifico MIP
 * @param {String} code codice errore esterno (e.g. fetch error)
 * @param {String} errorMsg messaggio di errore
 * 
 * @returns un oggetto contenente la descrizione dell'errore
 */
function createPlanError(mipCode, code, errorMsg) {
    return {
        error: {
            mipErrorCode: mipCode,
            errorCode: code ?? -1,
            errorMsg: errorMsg ?? null
        }
    }
}

/**
 * Traduce un oggetto di tipo Response ritornato da OTP.
 * 
 * Riferimento:
 * http://dev.opentripplanner.org/apidoc/1.0.0/json_Response.html
 * 
 * @param {String} mode modalità scelta per il piano
 * @param {Object} planResponse Response di OTP
 * 
 * @returns un oggetto contenente i dati da mostrare sulla GUI
 */
export function convertPlanResponse(mode, planResponse) {
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
            planTranslation = convertPlan(mode, planResponse?.plan)
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
        if (plan) {
            let translation = {
                mode: mode,
                startTime: plan?.date ?? Date.now(),
                startLocation: convertLocation(plan?.from),
                endLocation: convertLocation(plan?.to),

                itineraries: plan?.itineraries
                    ?.map((it, idx) => convertItinerary(idx, mode, it))
                    ?.filter(it => it !== null) ?? []
            }
            planTranslation = {
                plan: translation
            }
        }
    } catch (exc) {
        console.log(exc)
        planTranslation = createPlanError(MIPPlanError.INV_PLAN_FMT)
    }
    console.log(planTranslation)
    return planTranslation
}

/**
 * Traduce un oggetto di tipo Itinerary ritornato da OTP.
 * Riferimento:
 * http://dev.opentripplanner.org/apidoc/1.0.0/json_Itinerary.html
 * 
 * @param {Number} id id dell'itinerario
 * @param {String} mode modalità di trasporto
 * @param {Object} itinerary oggetto di tipo Itinerary
 * 
 * @returns un oggetto contenente i dati da mostrare sulla GUI o null in caso di itinerario non valido
 */
function convertItinerary(id, mode, itinerary) {
    let convertedItinerary = null
    try {
        if (itinerary) {
            convertedItinerary = {
                id: id,
                mode: mode,
                startTime: itinerary.startTime ?? Date.now(),
                endTime: itinerary.endTime ?? 0,
                duration_s: itinerary?.duration ?? 0,
                legs: itinerary.legs
                    ?.map((leg, idx) => convertLeg(idx, leg))
                    ?.filter(l => l) ?? []
            }
            let distance_m = 0
            if (convertedItinerary.legs.length == 0) {
                console.log(`skipping itinerary ${id}: with no legs`)
                convertItinerary = null
            } else {
                distance_m = convertedItinerary.legs.reduce((length, l2) =>
                    length + (l2?.distance_m ?? 0), 0)
            }
            if (convertedItinerary) {
                convertedItinerary['distance_m'] = distance_m
                convertItinerary['description'] = getItineraryDescription(itinerary)
            }
        }
    } catch (exc) {
        console.log(exc)
        convertedItinerary = null
    }
    console.log(convertedItinerary)
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
        if (leg) {
            convertdLeg = {
                id: id,
                mode: leg.mode,
                routeType: leg.routeType ?? -1,
                routeName: leg.route ?? null,
                startTime: leg.startTime ?? null,
                endTime: leg.endTime ?? null,
                duration_s: leg.duration ?? 0,
                distance_m: leg.distance ?? 0,
                startLocation: convertLocation(leg.from),
                endLocation: convertLocation(leg.to),

                // Transit leg data
                isTransit: leg.transitLeg ?? false,
                agencyName: leg.agencyName ?? null,
                agencyUrl: leg.agencyUrl ?? null,
                routeType: leg.routeType ?? -1,
                routeColor: leg.routeColor ?? null,    // colore default?
                routeTextColor: leg.routeTextColor == null,
                routeShortName: (leg.tripShortName || leg.routeShortName) ?? null,
                routeLongName: leg.routeLongName ?? null,
                headsign: leg.headsign ?? null,

                steps: leg?.steps
                    ?.map((step, idx) => convertStep(idx, step))
                    ?.filter(s => s) ?? [],
                intermediateStops: leg.intermediateStops
                    ?.map(convertLocation)
                    ?.filter(s => s) ?? [],
            }
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
        if (step) {
            convertdStep = {
                id: id,
                streetName: (step.bogusName ? null : step.streetName) ?? null,
                distance_m: step.distance ?? 0,
                exit: step.exit ?? null,
                area: step.area ?? false,
                stayOn: step.stayOn ?? false,
                relativeDirection: step.relativeDirection ?? null,
                absoluteDirection: step.absoluteDirection ?? null,
                icon: convertIcon(step.relativeDirection),
                latLon: (step.lat && step.lon) ? [step.lat, step.lon] : null, // controllare
            }
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
        if (location) {
            place = {
                vertexType: location.vertexType ?? "NORMAL",
                isTransit: location.vertexType === "TRANSIT",
                name: location.name ?? null,
                latLon: (location.lat && location.lon) ? [location.lat, location.lon] : null,
                departure: location?.departure ?? 0,
                arrival: location?.arrival ?? 0,
                // Transit vertex
                platformCode: location.platformCode ?? null,
                stopCode: location.stopCode ?? null,
                stopIndex: location.stopIndex ?? -1,
                stopSequence: location.stopSequence ?? -1,
                // Bike vertex 
                // TODO: completare
            }
        }
    } catch (exc) {
        console.log(exc)
        place = null
    }
    return place
}

/**
 * Traduce un oggetto di tipo RelativeDirection di OTP in un'icona
 * 
 * Riferimento:
 * http://dev.opentripplanner.org/apidoc/1.0.0/json_RelativeDirection.html
 *
 * @param {String} direction stringa che codifica la direzione
 * @returns la traduzione nella locale desiderata
 */
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

function getItineraryDescription(itinerary) {
    return null
}