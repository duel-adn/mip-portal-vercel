/**
    Duel S.p.A.

    API per l'acquisizione dei passi/colli alpini

    Revision history

    | Data       | Autore | Descrizione 
    | ---------- | ------ | ----------------------------------- |
    | 2021/08/10 | Duel   | Prima versione                      |
*/
function extractCoords(text) {
    const rawCoords = text.split(',').map(t => parseFloat(t))
    return rawCoords
}

export async function fetchPassData({locale}) {
    const res = await fetch(process.env.MIP_PASS_DATA_URL)
    const rawPassData = await res.json()
    console.log(process.env.MIP_PASS_DATA_URL + ' ' + rawPassData.length)
    const passData = rawPassData.map(rawPass => {
        return {
            name: rawPass.Nome,
            state: rawPass.Stato == 'Aperto',
            latitude: extractCoords(rawPass.Coordinate)[0],
            longitude: extractCoords(rawPass.Coordinate)[1]
        }})
    
    return passData.sort((p1, p2) => {
        let result = 0
        if (p1.state) {
            if (p2.state) {
                result = p1.name.localeCompare(p2.name)
            } else {
                result = -11
            }
        } else if (p2.state) {
            result = 1
        } else {
            result = p1.name.localeCompare(p2.name)
        }
        return result
    })
}
