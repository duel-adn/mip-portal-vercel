/**
    (C) Duel srl 2021.

    API per il calcolo del percorso.

    Revision history

    | Data       | Autore | Descrizione 
    | ---------- | ------ | ----------------------------------- |
    | 2021/08/10 | Duel   | Prima versione                      |
*/

import { MIPPlanMode } from "../components/path/MIPPathAPI"
import { translateUnixDateTime, translateUnixTime } from "./MIPi18n"
import { translateDistance, translateDuration } from "./MIPi18n"

export function translatePathMode(locale, mode) {
    let translation = null
    switch (mode) {
        case MIPPlanMode.publicTransport:
            translation = {
                iconBaseName: 'transit',
                iconAlt: 'mezzi',
                shortDescription: 'mezzi pubblici'
            }
            break
        case MIPPlanMode.bicicle:
            translation = {
                iconBaseName: 'bike',
                iconAlt: 'bike',
                shortDescription: 'bicicletta'
            }
            break

        case MIPPlanMode.pedestrian:
            translation = {
                iconBaseName: 'walk',
                iconAlt: 'piedi',
                shortDescription: 'a piedi'
            }
            break

        case MIPPlanMode.vehicle:
            translation = {
                iconBaseName: 'vehicle',
                iconAlt: 'auto',
                shortDescription: 'auto'
            }
            break

        default:
        // falls through
    }
    return translation
}

export function translateRouteType(locale, type) {
    let translation = {
        iconBaseName: 'walk',
        iconAlt: 'piedi',
        shortDescription: 'a piedi'
    }
    switch (type) {
        case 0:
            translation = {
                iconBaseName: 'tram',
                iconAlt: 'tram',
                shortDescription: 'in tram'
            }
            break
        case 1:
            translation = {
                iconBaseName: 'subway',
                iconAlt: 'metro',
                shortDescription: 'in metro'
            }
            break
        case 2:
            translation = {
                iconBaseName: 'train',
                iconAlt: 'treno',
                shortDescription: 'in treno'
            }
            break
        case 3:
            translation = {
                iconBaseName: 'bus',
                iconAlt: 'bus',
                shortDescription: 'in autobus'
            }
            break
        case 4:
            translation = {
                iconBaseName: 'ferry',
                iconAlt: 'traghetto',
                shortDescription: 'in traghetto'
            }
            break
        case 5:
        case 6:
        case 7:
            translation = {
                iconBaseName: 'cable-car',
                iconAlt: 'finivia',
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
    return error?.defaultMsg ?? "Errore sconosciuto"
}

/**
 * Traduce gli elementi dell'header del viaggio
 * 
 * @param {string} locale lingua da usare per i risultati 
 * @param {Object} plan piano da tradurre
 * @returns un oggetto di tipo Error o lista degli indirizzi
 */
export function translatePlanHeader(locale, plan) {
    return {
        fromLabel: 'da:',
        fromName: plan.startLocation?.name ?? "Strada senza nome",
        toLabel: 'a:',
        toName: plan.endLocation?.name ?? "Strada senza nome",
        departureLabel: 'partenza:',
        departure: translateUnixDateTime(plan.startTime ?? Date.now())
    }
}

/**
 * Traduce gli elementi dell'header di un itinerario
 * 
 * @param {string} locale lingua da usare per i risultati 
 * @param {Object} itinerary itinerario da tradurre
 * @returns un oggetto di tipo Error o lista degli indirizzi
 */
export function translateItineraryHeader(locale, itinerary) {
    const modeTranslation = translatePathMode(locale, itinerary?.mode)
    return {
        modeIconUrl: `/path-icons/${modeTranslation?.iconBaseName ?? 'transit'}.svg`,
        modeIconAlt: `Bus`,
        description: itinerary.description,
        cta: 'Dettagi',
        distance: translateDistance(locale, itinerary.distance_m),
        duration: translateDuration(locale, itinerary.duration_s),
        departureTime: itinerary.startTime > 0 ? 
            `partenza il ${translateUnixDateTime(locale, itinerary.startTime)}` : null,
        arrivalTime: itinerary.startTime > 0 ? 
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
export function translateLegHeader(locale, leg) {
    const modeTranslation = leg.isTransit ? translateRouteType(locale, leg.routeType) :
        translatePathMode(locale, leg?.mode)
    const duration = translateDuration(locale, leg.duration_s)
    const distance = translateDistance(locale, leg.distance_m)

    return {
        mode: leg?.mode ?? 'UNK',
        isTransit: leg.isTransit,
        shortDescription: modeTranslation.shortDescription,
        iconUrl: `/path-icons/${modeTranslation.iconBaseName}.svg`,
        iconAlt: modeTranslation.iconAlt,
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
export function translatePlanStep(locale, step) {
    return {
        streetName: step.streetName,
        exit: step.exit,
        relativeDirection: step.relativeDirection,
        absoluteDirection: step.absoluteDirection,
        icon: step.icon,
        distance: translateDistance(locale, step.distance_m),
        instruction: createVehicleInstruction(locale, step),
    }
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
