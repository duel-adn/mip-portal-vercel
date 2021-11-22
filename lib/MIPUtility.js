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

export function translateDuration(s) {
  const hours = Math.floor(s / 3600)
  const min = Math.round((s % 3600) / 60)
  const sec = s % 60
  const hoursTr = ['ora', 'ore']
  if (hours <= 0) {
    return `${min} min. ${sec} s`
  } else if (min <= 0) {
    return `${sec} s`
  }
  return `${hours} ${hoursTr[Number(hours > 1)]} ${min} min.`
}

export function translateDistance(d) {
  const km = Math.floor(d/1000)
  const m = Math.round(d % 1000)

  if (km <= 0) {
    return `${m} m`
  } 
  if (m == 0) {
    return `${km} Km`
  }

  return `${km} Km e ${m} m`
}