/**
    Duel S.p.A.

    Lista dei passi/colli alpini

    Revision history

    | Data       | Autore | Descrizione 
    | ---------- | ------ | ----------------------------------- |
    | 2021/08/10 | Duel   | Prima versione                      |
*/

import styles from './MIPPass.module.scss'
import {mipConcatenate} from '../../lib/MIPUtility'

function getStyle(style, pass) {
    return `${style} ${pass.state ? styles.open : styles.closed}`;
}

export function MIPPassDataCard({className, passData}) {
    const finalClassName = mipConcatenate(className, styles.data_card)
    return (
        <div className={finalClassName}>
            <h4 className={styles.name}>{passData.name}</h4>
            <p className={getStyle(styles.state, passData)}>{passData.state ? 'Aperto' : 'Chiuso'}</p>
            <p className={styles.open_hours}>{passData.open_hours}</p>
            <p className={styles.next_closure}>&bull; {passData.next_closure}</p>
        </div>
    )
}
export default function MIPPassDataList({className, passData}) {
    const finalClassName = mipConcatenate(className, styles.external_panel)

    return (
        <div className={finalClassName}>
        { passData && passData.map(pass => 
            <div className={getStyle(styles.list_frame, pass)} key={pass.name}>
                <MIPPassDataCard className={styles.event} passData={pass} />
            </div>
        )}
        </div>
    )
}

function extractCoords(text) {
    const rawCoords = text.split(',').map(t => parseFloat(t))
    return rawCoords
}
export async function fetchPassData(context) {
    const res = await fetch(process.env.MIP_PASS_DATA_URL)
    const rawPassData = await res.json()
    console.log(process.env.MIP_PASS_DATA_URL + ' ' + rawPassData.length)
    const passData = rawPassData.map(rawPass => {
        return {
            name: rawPass.Nome,
            state: rawPass.Stato == 'Aperto',
            open_hours: 'Aperto tutti i giorni ore 10-17',
            next_closure: 'Chiuso dal 25 al 30 agosto',
            latitude: extractCoords(rawPass.Coordinate)[0],
            longitude: extractCoords(rawPass.Coordinate)[1]
        }})
    
    return passData
}
