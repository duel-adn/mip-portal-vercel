/**
    (C) Duel srl 2021.

    Autocomplete API per i servizi di path planning.

    Revision history

    | Data       | Autore | Descrizione 
    | ---------- | ------ | ----------------------------------- |
    | 2021/08/10 | Duel   | Prima versione                      |
*/

export default async function reverseGeocodeHandler(req, res) {
  const query = req.url.slice(req.url.indexOf('?'))
  const completeUrl = `${process.env.NEXT_PUBLIC_MIP_REV_GEOCODE_URL}${query}`
  console.log('RG: ' + completeUrl)
  const response = await fetch(completeUrl, {
    //redirect: 'follow',
    credentials: 'omit',
    mode: 'cors',
    headers: {
      'Accept': 'application/json'
    }
  }).then(resp => {
    res.setHeader('Content-Type', 'application/json')
    if (resp.ok) {
      const json = await resp.json()
      if (json?.features?.length > 0) {
        const location = json.features.reduce(extractFeature, null)
        res.status(200).send(JSON.stringify(location))
      }
      res.status(404).json({
        error: {
          statusCode: 404,
          errorMessage: 'not found'
        }
      })
    } else {
      res.status(resp.status).json({
        error: {
          statusCode: res.status,
          errorMessage: res.statusText
        }
      })
    }
  })
}

function extractFeature(extracted, feature) {
  if (!(extracted?.label)) {
    const street = feature?.label
    const num = feature.housenumber
    const city = feature?.locality
    const coords = feature?.geometry?.coordinates
    let value = extracted
    if (coords) {
      let label = null
      if (street) {
        label = street
        if (housenumber) {
          label += ` ${housenumber}`
        }
        if (city) {
          label += `, ${city}`
        } 
      }
      if (label) {
        value = {
          input: street,
          id: feature.properties.id,
          name: label,
          label: label,
          value: feature.properties.id,
          coordinates: coords
        }
      }
    }
  }
  return value
}
