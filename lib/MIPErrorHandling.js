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
