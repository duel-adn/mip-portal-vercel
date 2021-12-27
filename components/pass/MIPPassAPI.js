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
    const regex = /[A-Z](?=[^A-Z]*$)/
    const passData = rawPassData.map(rawPass => {
        const capIndex = rawPass.Nome.match(regex).index
        const sortName = rawPass.Nome.substring(capIndex)
        return {
            name: rawPass.Nome,
            sortName: sortName,
            state: rawPass.Stato == 'Aperto',
            latitude: extractCoords(rawPass.Coordinate)[0],
            longitude: extractCoords(rawPass.Coordinate)[1]
        }})
        return passData.sort((p1, p2) => p1.sortName.localeCompare(p2.sortName))
    }
