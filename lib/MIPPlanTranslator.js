/**
    (C) Duel srl 2021.

    API per il calcolo del percorso.

    Revision history

    | Data       | Autore | Descrizione 
    | ---------- | ------ | ----------------------------------- |
    | 2021/08/10 | Duel   | Prima versione                      |
*/

import { MIPPlanMode } from "../components/path/MIPPathAPI"

import { translateUnixDateTime, translateUnixDate, translateUnixTime } from "./MIPi18n"
import { translateDistance, translateDuration } from "./MIPi18n"

/**
 * Traduzione di un piano nella locale scelta
 * @param {String} locale sigla di una delle locale supportate
 * @param {Object} plan Struttura generata dal PlanConverter
 * 
 * @returns un oggetto con la traduzione
 */
export function translatePlanResponse(locale, plan) {
    let translatedPlan = null
    try {
        if (plan?.error) {
            translatedPlan = {
                error: {
                    ...plan.error
                }
            }
        } else if (plan.plan) {
            translatedPlan = {
                description: translatePlanDescription(locale, plan.plan),
                itineraries: plan?.plan?.itineraries
                    ?.map((it) => translateItinerary(locale, it))
                    ?.filter(it => it) ?? [],

            }
        }
    }
    catch (exc) {
        return {
            error: {
                errorMsg: "Errore inatteso: " + exc
            }
        }
    }
    return translatedPlan
}

/**
 * Traduce gli elementi dell'header del viaggio
 * 
 * @param {string} locale lingua da usare per i risultati 
 * @param {Object} plan piano da tradurre
 * 
 * @returns un oggetto di tipo Error o lista degli indirizzi
 */
export function translatePlanDescription(locale, plan) {
    return {
        fromLabel: 'da:',
        fromName: translateLocationName(plan.startLocation),
        toLabel: 'a:',
        toName: translateLocationName(plan.endLocation),
        departureLabel: 'partenza:',
        departureDateTime: translateUnixDateTime(locale, plan.startTime ?? Date.now())
    }
}

/**
 * Traduzione di un itinerario
 * 
 * @param {string} locale lingua da usare per i risultati 
 * @param {Object} itinerary itinerario da tradurre
 * 
 * @returns un oggetto contenente la traduzione dell'itinerario
 */
function translateItinerary(locale, itinerary) {
    let translatedItinerary = null
    try {
        if (itinerary) {
            translatedItinerary = {
                id: itinerary.id,
                description: translateItineraryDescription(locale, itinerary),
                legs: itinerary.legs
                    ?.map(l => translateLeg(itinerary, l))
                    ?.filter(l => l) ?? [],
            }
        }
    } catch (exc) {
        console.log(exc)
    }
    return translatedItinerary
}

/**
 * Traduce una tratta di un itinerario nella locale richiesta
 * @param {string} locale locale da usare per la traduzione
 * @param {Object} leg tratta creata dal planer converter
 * @returns un oggetto con i dati della tratta tradotti
 */
function translateLeg(locale, leg) {
    let translatedLeg = null
    try {
        if (leg) {
            translatedLeg = {
                id: leg.id,
                isTransit: leg.isTransit,
                description: translateLegDescription(locale, leg),
                steps: leg.steps
                    ?.map(step => translatePlanStep(locale, step))
                    ?.filter(s => s) ?? [],
                stops: leg.intermediateStops
                    ?.map(stop => translateIntermediateStop(locale, stop))
                    ?.filter(s => s) ?? [],
            }
        }
    } catch (exc) {
        console.log(exc)
    }
    return translatedLeg
}

/**
 * Traduce gli elementi dell'header di un itinerario
 * 
 * @param {string} locale lingua da usare per i risultati 
 * @param {Object} itinerary itinerario da tradurre
 * @returns un oggetto di tipo Error o lista degli indirizzi
 */
export function translateItineraryDescription(locale, itinerary) {
    const modeTranslation = translatePathMode(locale, itinerary?.mode)
    const pictogram = createTransitPictogram(locale, itinerary)
    return {
        ...modeTranslation,
        pictogram: pictogram,
        description: itinerary.description ?? null,
        detailsLabel: 'Dettagi',
        distance: translateDistance(locale, itinerary.distance_m),
        duration: translateDuration(locale, itinerary.duration_s),
        departure: itinerary.startTime > 0 ?
            `partenza ${translateUnixDateTime(locale, itinerary.startTime)}` : null,
        departureDate: translateUnixDate(itinerary.startTime),
        departureTime: translateUnixTime(itinerary.startTime),
        arrival: itinerary.endTime > 0 ?
            `arrivo alle ${translateUnixTime(locale, itinerary.endTime)}` : null
    }
}

/**
 * Traduce gli elementi dell'header di una leg
 * 
 * @param {string} locale lingua da usare per i risultati 
 * @param {Object} leg leg da tradurre
 * @returns un oggetto di tipo Error o lista degli indirizzi
 */
 export function translateLegDescription(locale, leg) {
    const modeTranslation = leg.isTransit ? translateRouteType(locale, leg.routeType) :
        translatePathMode(locale, leg?.mode)
    const duration = translateDuration(locale, leg.duration_s)
    const distance = translateDistance(locale, leg.distance_m)

    return {
        id: leg.id,
        mode: leg?.mode ?? 'UNK',
        isTransit: leg.isTransit,

        ...modeTranslation,

        destination: translateLocationName(leg.endLocation),
        duration: duration,
        distance: distance,
    }
}

/**
 * Traduce gli elementi dell'header di una step
 * 
 * @param {string} locale lingua da usare per i risultati 
 * @param {Object} leg step da tradurre
 * @returns un oggetto di tipo Error o lista degli indirizzi
 */
 function translatePlanStep(locale, step) {
    return {
        id: step.id,
        streetName: step.streetName,
        exit: step.exit,
        relativeDirection: step.relativeDirection,
        absoluteDirection: step.absoluteDirection,
        icon: step.icon,
        distance: translateDistance(locale, step.distance_m),
        instruction: createVehicleInstruction(locale, step),
    }
}

/**
 * Traduce le caratteristiche di una fermata (Place)
 * 
 * http://dev.opentripplanner.org/apidoc/1.0.0/json_Place.html
 * 
 * @param {String} locale locale da usare per la traduzione
 * @param {Object} stop oggett Location da tradurre
 * @returns 
 */
function translateIntermediateStop(locale, stop) {
    let translatedStop = null
    try {
        if (stop) {
            translatedStop = {
                name: stop?.name,
                departureTime: translateUnixTime(stop.departure)
            }
        }
    } catch (exc) {
        console.log(exc)
    }
    return translatedStop
}

export function translatePathMode(locale, mode) {
    let translation = null
    switch (mode) {
        case MIPPlanMode.publicTransport:
            translation = {
                iconName: 'transit',
                iconAlt: 'mezzi',
                modeDescription: 'mezzi pubblici'
            }
            break
        case MIPPlanMode.bicicle:
            translation = {
                iconName: 'bike',
                iconAlt: 'bike',
                modeDescription: 'bicicletta'
            }
            break

        case MIPPlanMode.pedestrian:
            translation = {
                iconName: 'walk',
                iconAlt: 'piedi',
                modeDescription: 'a piedi'
            }
            break

        case MIPPlanMode.vehicle:
            translation = {
                iconName: 'vehicle',
                iconAlt: 'auto',
                modeDescription: 'auto'
            }
            break

        default:
        // falls through
    }
    return translation
}

// --------

export function translateRouteType(locale, type) {
    let translation = {
        iconName: 'walk',
        iconAlt: 'piedi',
        shortDescription: 'a piedi'
    }
    switch (type) {
        case 0:
            translation = {
                iconName: 'tram',
                iconAlt: 'tram',
                shortDescription: 'in tram'
            }
            break
        case 1:
            translation = {
                iconName: 'subway',
                iconAlt: 'metro',
                shortDescription: 'in metro'
            }
            break
        case 2:
            translation = {
                iconName: 'train',
                iconAlt: 'treno',
                shortDescription: 'in treno'
            }
            break
        case 3:
            translation = {
                iconName: 'bus',
                iconAlt: 'bus',
                shortDescription: 'in autobus'
            }
            break
        case 4:
            translation = {
                iconName: 'ferry',
                iconAlt: 'traghetto',
                shortDescription: 'in traghetto'
            }
            break
        case 5:
        case 6:
        case 7:
            translation = {
                iconName: 'cable-car',
                iconAlt: 'funivia',
                shortDescription: 'in funivia'
            }
            break
        default:
        // falls through
    }
    return translation
}

/**
 * Traduce struttura contenente i messaggi di errore 
 * provenienti dal server per il calcolo percorso
 * 
 * @param {String} locale lingua per traduzione
 * @param {Object} error struttura contenente gli errori
 * @returns traduzione delstruttura
 */
export function translatePlanErrors(locale, error) {
    // TODO: complete
    return error?.errorMsg ?? "Errore sconosciuto"
}

function createVehicleInstruction(locale, step) {
    const streetName = step.streetName
    const exit = step.exit
    let instruction = "prosegui"
    switch (step.relativeDirection) {
        case "DEPART":
            instruction = generateInstruction(locale, "percorri", "", streetName)
            break
        case "CONTINUE":
            instruction = generateInstruction(locale, "prosegui", "per", streetName, step.absoluteDirection)
            break
        case "SLIGHTLY_LEFT":
            instruction = generateInstruction(locale, "gira leggermente a sinistra", "verso", streetName)
            break
        case "LEFT":
        case "HARD_LEFT":
            instruction = generateInstruction(locale, "gira a sinistra", "verso", streetName)
            break
        case "SLIGHTLY_RIGHT":
            instruction = generateInstruction(locale, "gira leggermente a destra", "verso", streetName)
            break
        case "RIGHT":
        case "HARD_RIGHT":
            instruction = generateInstruction(locale, "gira a destra", "verso", streetName)
            break
        case "ELEVATOR":
            instruction = generateInstruction(locale, "prendi l'ascensore", "per", streetName)
            break
        case "UTURN_LEFT":
        case "UTURN_RIGHT":
            instruction = generateInstruction(locale, "esegui un'inversione a U", "verso", streetName)
            break
        case "CIRCLE_CLOCKWISE":
        case "CIRCLE_COUNTERCLOCKWISE":
            instruction = generateRoundaboutInstruction(locale, streetName, exit)
            break
        default:
    }
    return instruction
}

function generateInstruction(locale, verb, conj, streetName, absoluteDirection) {
    if (streetName) {
        return [[false, `${verb} ${conj}`], [true, streetName]]
    }
    let direction = translateAbsoluteDirection(absoluteDirection)
    return direction ? [[false, `${verb} verso`], [true, direction]] : [[false, verb]]
}

const exitOrdinals = [null, 'la prima', 'la seconda', 'la terza', 'la quarta', 'la quinta',
    'la sesta', 'la settima', "l'ottava", "la nona", "la decima"]

function generateRoundaboutInstruction(locale, streetName, exit) {
    let exitTranslation = (exit > 0) && (exit < exitOrdinals.length) ?
        `${exitOrdinals[exit]} uscita` : (exit ? "l'uscita " + exit : null)
    let translation = [[false, "prosegui verso"], [true, "SUD"]]
    if (exitTranslation) {
        if (streetName) {
            translation = [[false, "su"], [true, streetName], [false, ", prendi"],
            [true, exitTranslation]]
        } else {
            translation = [[false, "alla rotonda, prendi"], [true, exitTranslation]]
        }
    } else if (streetName) {
        translation = [[false, "prosegui per"], [true, streetName]]
    }

    return translation
}

/**
 * Traduce un oggetto di tipo AbsoluteDirection di OTP
 * Riferimento:
 * // http://dev.opentripplanner.org/apidoc/1.0.0/json_AbsoluteDirection.html
 *
 * @param {String} direction stringa che codifica direzione
 * @returns traduzione nellocale desiderata
 */
function translateAbsoluteDirection(locale, direction) {
    switch (direction) {
        case "NORTH": return "nord"
        case "NORTHEAST": return "nord-est"
        case "EAST": return "est"
        case "SOUTHEAST": return "sud-est"
        case "SOUTH": return "sud"
        case "SOUTHWEST": return "sud-ovest"
        case "WEST": return "ovest"
        case "NORTHWEST": return "nord-ovest"
        default:
    }
    return null
}

// TODO: verificare possibilità di usare altre 
// informazioni per transit
function translateLocationName(location) {
    return location?.isTransit ?
        location?.name ?? "strada senza nome"
        : location?.name ?? "strada senza nome"
}

function createTransitPictogram(locale, itinerary) {
    const pictogram = itinerary?.legs?.reduce((val, leg) => {
        const type = translateRouteType(locale, leg.routeType)
        const color = '#' + (leg.routeColor ?? "fff").toLowerCase()
        const routeTextColor = '#' + (leg.routeTextColor ?? "000")
        const name = leg.route ?? leg.routeShortName ?? leg.routeLongName
        const borderColor = (color === 'white' || color === '#fff' || color === '#ffffff') ? '#bbb' : color

        val.push( leg.isTransit ? {
            iconName: type.iconName,
            iconAlt: type.iconAlt,
            name: name,
            color: color,
            textColor: routeTextColor,
            borderColor: borderColor
        } : {
            iconName: type.iconName,
            iconAlt: type.iconAlt,
        })
        return val
    }, [])
    console.log(pictogram)
    return pictogram
}