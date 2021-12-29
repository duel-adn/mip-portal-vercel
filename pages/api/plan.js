/**
    (C) Duel srl 2021.

    Plan API per i servizi di path planning.

    Revision history

    | Data       | Autore | Descrizione 
    | ---------- | ------ | ----------------------------------- |
    | 2021/08/10 | Duel   | Prima versione                      |
*/

export default async function planHandler(req, res) {
    const query = req.url.slice(req.url.indexOf('?'))
    const completeUrl = `${process.env.NEXT_PUBLIC_MIP_PATH_PLAN_URL}${query}`
    console.log('PH: ' + completeUrl)
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



