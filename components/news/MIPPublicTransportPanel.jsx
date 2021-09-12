/**
    (C) Duel srl 2021.

    Pannello informazioni trasporto pubblico.

    Revision history

    | Data       | Autore | Descrizione 
    | ---------- | ------ | ----------------------------------- |
    | 2021/08/10 | Duel   | Prima versione                      |
*/

import styles from './MIPNews.module.scss'
import MIPInformationPanel from "../forms/MIPInformationPanel"

function showDate(text) {
    const theDate = new Date(text)
    return theDate.toLocaleDateString('it') || ''
}
export default function MIPPublicTransportPanel(props) {
    return (
        <MIPInformationPanel title={props.title}>
            {props.publicTransportData && props.publicTransportData.map(data =>
                <div className={styles.public_transport_card} key={data.id}>
                    <div className={`mip-tag mip-bg-dark-blue ${styles.tag}`}>{data.type}</div>
                    <h3 className={styles.title}>{data.title}</h3>
                    <p className={styles.content}>{data.description.length > 200 ? data.description.substring(0, 197) + "..." : data.description}</p>
                    <div className={styles.footer}>
                        <div>{showDate(data.validitystart)}</div>
                        <div className={styles.expander}>Espandi</div>
                    </div>
                </div>
            )}
        </MIPInformationPanel>
    )
}

export async function fetchPublicTransportData(context) {
    const res = await fetch(process.env.MIP_TPL_URL)
    const news = await res.json()
    console.log(`${process.env.MIP_TPL_URL} (${news.length})`)
    return news
}