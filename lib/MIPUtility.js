export function mipConcatenate(...args) {
  return args.filter(c => c !== undefined)
    .join(' ').trim()
}

export function debounce(func, timeout = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => { func.apply(this, args); }, timeout);
  };
}

function checkReponse(response) {
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response;
}

export async function mipFetch(url, params) {
  // Aggiunge i parametri della query
  const query = typeof params == 'object' ?
    Object.entries(params).map(([k, v]) => `${k}=${v}`).join('&') :
    typeof params == 'string' ? params : undefined

  const completeUrl = query ? `${url}?${query}` : url
  console.log('fetching: ' + completeUrl)
  const response = await fetch(completeUrl, {
    //redirect: 'follow',
    credentials: 'omit',
    mode: 'cors',
    headers: {
      'Accept': 'application/json'
    }
  }).then(response => checkReponse(response))
    .then(response => response.json())
    .catch(error => {
      console.log('Caught')
      console.log(error)
      return error
    })
    return response
}