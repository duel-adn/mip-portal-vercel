/**
    (C) Duel srl 2021.

    Procedure di gestione errori

    Revision history

    | Data       | Autore | Descrizione 
    | ---------- | ------ | ----------------------------------- |
    | 2021/11/03 | Duel   | Prima versione                      |
*/

/**
 * Crea un oggetto di tipo errore
 * @param {String} mipErrorCode codice di errore MIP
 * @param {String} errorCode codice di errore specifico del componente/servizio
 * @param {String} errorMessage messaggio di errore non localizzato
 * @returns un oggetto con i dati pasati
 */
export function mipCreateError(mipErrorCode, errorCode, errorMessage) {
    if (!MIPErrorCode[mipErrorCode]) {
        console.log("Internal error, unknown error code:" + errorCode)
    }
    return {
        error: {
            mipErrorCode,
            errorCode,
            originalMessage: errorMessage
        }
    }
}

/**
 * 
 */
 export const MIPErrorContext = {
    FETCH: "Fetch",
    ADDR_COMPLETE: "AddrAutocomplete",
    GEOCODE: "Geocode",
    USR_POSITION: "UserPosition",
    PLANNING: "PathPlanning"
  }
  
  
/**
 * Codici di errore previsti in ambito MIP
 */
export const MIPErrorCode = {
    MIP_UNKNOWN_ERROR: "MipUnknownError",
    MIP_CONNECTION_ERROR: "MipConnectionError",
    MIP_HTTP_UNKNOWN: "MipHttpUnknown",
    MIP_HTTP_300: "MipHttpRedirect",
    MIP_HTTP_400: "MipHttpClientError",
    MIP_HTTP_403: "MipHttpForbidden",
    MIP_HTTP_500: "MipHttpServerError",
    MIP_INV_SRV_RESP: "MipInvalidServerResponse",
    
    // Position error
    MIP_POSITION_NOT_SUPPORTED: "MipPositionNotSupported",
    MIP_REV_GEOCODE_ERROR: "MipReverseGeocodeError",
    MIP_POS_DENIED: "MipPositionDenied",
    MIP_POS_UNAVAILABLE: "MipPositionDenied",
    MIP_POS_TIMEOUT: "MipPositionTimeout",
    MIP_POS_UNKNOWN: "MipPosUnknown",
    // OTP ERRORS

    MIP_INV_PLAN_FMT: "MipInvalidPlanFormat",
}

const MIPPlannerError = {
    PLAN_OK: "Ok",
    FETCH_ERROR: "FetchError",
    SERVER_ERROR: "ServerError",
    INV_RESP_FMT: "InvalidResponseFormat",
    INV_PLAN_FMT: "InvalidPlanFormat",
    INV_LOCATION_FMT: "InvalidItineraryFormat",
    INV_ITINERARY_FMT: "InvalidItineraryFormat",
    INV_LEG_FMT: "InvalidItineraryFormat",
    INV_STEP_FMT: "InvalidItineraryFormat",
    REV_GEOCODE_ERROR: "ReverseGeocodeError",
    REV_GEOCODE_NO_LOCATION: "ReverseGeocodeNoLocation",
    POSITION_NOT_SUPPORTED: "PositionNotSupporrted",
    POSITION_PERMISSION_DENIED: "PositionPermissionDenied",
    POSITION_NOT_AVAILABLE: "PositionNotAvailable",
    POSITION_TIMEOUT: "PositionTimeout",
    POSITION_UNKNOWN_ERROR: "PositionUnknownError"
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
    "POSITION_NOT_ACCESSIBLE": "Una o entrambe le località non sono accessibili",
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
