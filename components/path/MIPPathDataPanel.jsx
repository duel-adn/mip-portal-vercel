/**
    Duel S.p.A.

    Form per l'input dei dati per la ricerca del percorso.

    Revision history

    | Data       | Autore | Descrizione 
    | ---------- | ------ | ----------------------------------- |
    | 2021/08/10 | Duel   | Prima versione                      |
*/

import styles from './MIPPath.module.scss';
import MIPPathDataForm from './MIPPathDataForm';

export default function MIPPathDataPanel(props) {
    return (
    <div className={`${props.className} ${styles.path_data_panel}`}>
        <h3 className={`${styles.title}`}>{props.title}</h3>
        <MIPPathDataForm className="mip-rounded-corners" title="Ricerca percorso" />
    </div>

    )
}
