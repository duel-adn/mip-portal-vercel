/**
    (C) Duel srl 2021.

    Funzioni di utilità generale

    Revision history

    | Data       | Autore | Descrizione 
    | ---------- | ------ | ----------------------------------- |
    | 2021/11/03 | Duel   | Prima versione                      |
*/

/**
 * 
 */
export const MIPContext = {
  FETCH: "Fetch",
  ADDR_COMPLETE: "AddrAutocomplete",
  GEOCODE: "Geocode",
  USR_POSITION: "UserPosition",
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
      mipCreateError(MIPContext.FETCH, response.status, response.statusText))
    .catch(error => {
      console.log(error)
      return mipCreateError(MIPContext.FETCH, -1, error)
    })
  return response
}

/**
 * Crea un oggetto di tipo errore
 * @param {*} context Contesto nel quale è avvenuto l'errore
 * @param {*} errorCode codice di errore (dipende dal contesto)
 * @param {*} errorMessage messaggio di errore non localizzato
 * @returns un oggetto con i dati pasati
 */
export function mipCreateError(context, errorCode, errorMessage) {
  return {
    error: {
      context: context,
      errorCode: errorCode,
      originalMessage: errorMessage,
      localizedMessage: null
    }
  }
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

export function mipCreateId() {
  return Math.round(Date.now() * Math.random() % 1e6)
}

