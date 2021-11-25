/**
    (C) Duel srl 2021.

    Pannello informazioni su mobilità.

    Revision history

    | Data       | Autore | Descrizione 
    | ---------- | ------ | ----------------------------------- |
    | 2021/08/10 | Duel   | Prima versione                      |
*/

import Link from 'next/link'
import styles from './MIPNews.module.scss'
import MIPInformationPanel from "../forms/MIPInformationPanel"

function showDate(text) {
    const theDate = new Date(text)
    return theDate.toLocaleDateString('it') || ''
}
export default function MIPMobilityNewsPanel(props) {
    return (
        <MIPInformationPanel className={props.className} title={props.title}>
            {props.newsData && props.newsData.map(data =>
                <div className={styles.public_transport_card} key={data.id}>
                    <div className={`mip-tag mip-bg-blue ${styles.tag}`}>News</div>
                    <h3 className={styles.title}>{data.title}</h3>
                    <p className={styles.content}>{data.description.length > 200 ? data.description.substring(0, 197) + "..." : data.description}</p>
                    <div className={styles.footer}>
                        <div>{showDate(data.validitystart)}</div>
                        <Link href="/article"><a>Leggi tutto</a></Link>
                    </div>
                </div>
            )}
        </MIPInformationPanel>
    )
}
