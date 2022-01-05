/**
    (C) Duel srl 2021.

    Funzioni di utilità generale

    Revision history

    | Data       | Autore | Descrizione 
    | ---------- | ------ | ----------------------------------- |
    | 2021/11/03 | Duel   | Prima versione                      |
*/

import { MIPErrorCode, mipCreateError } from "./MIPErrorHandling"

function mapHttpStatusCode(status) {
  const statusStr = `MIP_HTTP_${status}`
  const genStatusStr = `MIP_HTTP_${Math.floor(status / 100) * 100}`
  return MIPErrorCode[statusStr] ?? MIPErrorCode[genStatusStr] ?? MIPErrorCode.MIP_HTTP_UNKNOWN
}
/**
 * Fetcher utilizzato per accedere ai contenuti JSON
 * 
 * @param {String} url url di base
 * @param {*} params parametri query
 * @returns il risultato della query o un oggetto generato da mipCreateError
 */
export async function mipFetch(url, params) {
  // Aggiunge i parametri della query
  const query = typeof params == 'object' ?
    Object.entries(params).map(([k, v]) => `${k}=${v}`).join('&') :
    typeof params == 'string' ? params : undefined

  // todo: escape URI
  const completeUrl = query ? `${url}?${query}` : url
  console.log('fetching: ' + completeUrl)
  const response = await fetch(completeUrl, {
    //redirect: 'follow',
    credentials: 'omit',
    mode: 'cors',
    headers: {
      'Accept': 'application/json'
    }
  })
    .then(response => response.ok ?
      response.json() :
      mipCreateError(mapHttpStatusCode(response.status), `${response.status}`, response.statusText))
    .catch(error => {
      console.log(error)
      return mipCreateError(MIPErrorCode.MIP_CONNECTION_ERROR, null, error)
    })
  return response
}

/**
 * Concatena le stringhe passate come argomenti eliminando
 * quelle undefined e null e inserendo uno spazio
 * @param  {...any} args 
 * @returns una stringa con la concatenazione
 */
export function mipConcatenate(...args) {
  return args.filter(a => a).join(' ').trim()
}

/**
 * Introduce un ritardo minimo tra operazioni dello stesso tipo
 * @param {Function} func funzione da richiamare dopo il timeot
 * @param {*} timeout timeout minimo
 * @returns il risultato dell'applicazione della funzione
 */
export function mipDebounce(func, timeout = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => { func.apply(this, args); }, timeout);
  };
}

/**
 * Crea un Id con un'altissima probabilità di essere unico
 * nel contesto di una sessione dell'utente.
 * 
 * @returns un Id random
 */
export function mipCreateId() {
  return Math.round(Date.now() * Math.random() % 1e6)
}

