/**
    (C) Duel srl 2021.

    Autocomplete API per i servizi di path planning.

    Revision history

    | Data       | Autore | Descrizione 
    | ---------- | ------ | ----------------------------------- |
    | 2021/08/10 | Duel   | Prima versione                      |
*/

export default async function autocompleteHandler(req, res) {
    const { lang, text } = req.query
    const reqLang = lang || 'IT'
    const reqString = encodeURIComponent(text?.toLowerCase()?.trim() ?? '')
    
    if (reqString.length > 2) {
        const completeUrl = `${process.env.NEXT_PUBLIC_MIP_AUTOCOMPLETE_URL}?lang=${reqLang}&text=${reqString}`
        console.log('AC: fetching: ' + completeUrl)
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
                res.status(200).send(resp.body)
            } else {
                res.status(resp.status).json({
                    fetchError: {
                      statusCode: res.status,
                      errorMessage: res.statusText
                    }
                  })
            }
        })
    }
}