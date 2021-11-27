/**
    (C) Duel srl 2021.

    API per il calcolo del percorso.

    Revision history

    | Data       | Autore | Descrizione 
    | ---------- | ------ | ----------------------------------- |
    | 2021/08/10 | Duel   | Prima versione                      |
*/

import { PathPlanMode } from "../components/path/MIPPathAPI"
import { translateUnixDateTime, translateUnixTime } from "./MIPi18n"
import { translateDistance, translateDuration } from "./MIPi18n"

export function translatePathMode(locale, mode) {
    let translation = null
    switch (mode) {
        case PathPlanMode.publicTransport:
            translation = {
                iconBaseName: 'transit',
                iconAlt: 'mezzi',
                shortDescription: 'mezzi pubblici'
            }
            break
        case PathPlanMode.bicicle:
            translation = {
                iconBaseName: 'bike',
                iconAlt: 'bike',
                shortDescription: 'bicicletta'
            }
            break

        case PathPlanMode.pedestrian:
            translation = {
                iconBaseName: 'walk',
                iconAlt: 'piedi',
                shortDescription: 'a piedi'
            }
            break

        case PathPlanMode.vehicle:
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
 * Traduce la struttura contenente i messaggi di errore 
 * provenienti dal server per il calcolo percorso
 * 
 * @param {String} locale lingua per la traduzione
 * @param {Object} error struttura contenente gli errori
 * @returns la traduzione della struttura
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
 * @returns un oggetto di tipo Error o la lista degli indirizzi
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
 * @returns un oggetto di tipo Error o la lista degli indirizzi
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
 * @returns un oggetto di tipo Error o la lista degli indirizzi
 */
export function translateLegHeader(locale, leg) {
    const modeTranslation = translatePathMode(locale, leg?.mode)
    const routeTypeTranslation = translateRouteType(locale, leg.routeType)
    const duration = translateDuration(locale, leg.duration_s)
    const distance = translateDistance(locale, leg.distance_m)
    const iconBase = leg.isTransit ? routeTypeTranslation.iconBaseName : modeTranslation.iconBaseName
    const iconAlt = leg.isTransit ? routeTypeTranslation.iconAlt : modeTranslation.iconAlt

    return {
        mode: leg?.mode ?? 'UNK',
        isTransit: leg.isTransit,
        shortDescription: routeTypeTranslation.shortDescription,
        iconUrl: `/path-icons/${iconBase}.svg`,
        iconAlt: iconAlt,
        duration: duration,
        distance: distance,
    }
}

/**
 * Traduce gli elementi dell'header di una step
 * 
 * @param {string} locale lingua da usare per i risultati 
 * @param {Object} leg step da tradurre
 * @returns un oggetto di tipo Error o la lista degli indirizzi
 */
export function translatePlanStep(locale, step) {
    return {
        streetName: step.streetName,
        exit: step.exit,
        relativeDirection: step.relativeDirection,
        absoluteDirection: step.absoluteDirection,
        icon: step.icon,
        distance: translateDistance(locale, step.distance_m),
        instruction: `${step.relativeDirection} ${step.streetName}`,
    }
}

/**
 * Traduce un oggetto di tipo RelativeDirection di OTP
 * Riferimento:
 * http://dev.opentripplanner.org/apidoc/1.0.0/json_RelativeDirection.html
 *
 * @param {String} direction stringa che codifica la direzione
 * @returns la traduzione nella locale desiderata
 */

function convertRelativeDirection(direction) {
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

/**
 * Traduce un oggetto di tipo AbsoluteDirection di OTP
 * Riferimento:
 * // http://dev.opentripplanner.org/apidoc/1.0.0/json_AbsoluteDirection.html
 *
 * @param {String} direction stringa che codifica la direzione
 * @returns la traduzione nella locale desiderata
 */
function convertAbsoluteDirection(direction) {
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
