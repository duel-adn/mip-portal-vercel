/**
    (C) Duel srl 2021.

    API per il calcolo del percorso.

    Revision history

    | Data       | Autore | Descrizione 
    | ---------- | ------ | ----------------------------------- |
    | 2021/08/10 | Duel   | Prima versione                      |
*/

import { translateUnixDateTime } from "./MIPi18n"
import { translateDistance, translateDuration } from "./MIPi18n"

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
    return {
        distance: translateDistance(locale, itinerary.distance_m),
        duration: translateDuration(locale, itinerary.duration_s),
        arrival: translateUnixDateTime(locale, itinerary.startTime ?? '')
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
    return {
        mode: leg?.mode ?? 'UNK',
        duration: translateDuration(locale, leg.duration_s),
        distance: translateDistance(locale, leg.distance_m),
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
