export function mipCoalesce() {
  return arguments.reduce((a1, a2) =>
    a1 ?? a2
  )
}

export function mipFormatUnixTime(time, locale) {
  return new Intl.DateTimeFormat(locale ?? 'it-IT',
    {
      dateStyle: 'long',
      timeStyle: "short"
    }).format(time)
}

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

function decodeResponse(response) {
  if (!response.ok) {
    return {
      fetchError: {
        statusCode: response.status,
        errorMessage: response.statusText
      }
    }
  }
  return response.json();
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
  }).then(response => decodeResponse(response))
    .catch(error => {
      console.log('Caught')
      console.log(error)
      return {
        fetchError: {
          statusCode: -1,
          errorMessage: error
        }
      }
    })
  return response
}
