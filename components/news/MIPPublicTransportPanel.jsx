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

export default function MIPPublicTransportPanel(props) {
    return (
        <MIPInformationPanel className={props.className} title={props.title}>
            {props.publicTransportData && props.publicTransportData.map(data =>
                <div className={styles.public_transport_card} key={data.id}>
                    <div className={`mip-tag mip-bg-dark-blue ${styles.tag}`}>{data.type}</div>
                    <h3 className={styles.title}>{data.title}</h3>
                    <p className={styles.content}>{data.description.length > 200 ? data.description.substring(0, 197) + "..." : data.description}</p>
                    <div className={styles.footer}>
                        <div>{data.validitystart}</div>
                        <div className={styles.expander}>Espandi</div>
                    </div>
                </div>
            )}
        </MIPInformationPanel>
    )
}

