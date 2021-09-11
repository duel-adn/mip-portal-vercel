/**
    Duel S.p.A.

    Form per l'input dei dati per la ricerca del percorso.

    Revision history

    | Data       | Autore | Descrizione 
    | ---------- | ------ | ----------------------------------- |
    | 2021/08/10 | Duel   | Prima versione                      |
*/

import styles from './MIPPath.module.scss';
import MIPRoundedCheckbox from '../forms/MIPRoundedCheckbox';

function InputWithIcon(props) {
    return (
    <div className={styles.input}>
        <img src={props.icon} />
        <input type="text" placeholder={props.placeholder} />
    </div>
    )
}
export default function MIPPathDataForm(props) {
    return (
    <form className={`${props.className} ${styles.path_data_dialog}`}>
        <div className={styles.path_input}>
            <InputWithIcon icon='/icons/path-start.svg' placeholder='Scegli il punto di partenza' />
            <div className={styles.divisor}>
            <img src="/icons/path-swap.svg" alt="inverti partenza e destinazione" />
            </div>
            <InputWithIcon icon='/icons/path-dest.svg' placeholder='Scegli il punto di partenza' />
        </div>
        <div className={styles.button_bar_title} >Mostra percorso</div>
        <div className={styles.button_bar}>
            <MIPRoundedCheckbox title="auto" icon='/icons/car.svg' checked={true}/>
            <MIPRoundedCheckbox title="mezzi pubblici" icon='/icons/bus.svg' />
            <MIPRoundedCheckbox title="bicicletta" icon='/icons/bike.svg' />
            <MIPRoundedCheckbox title="a piedi" icon='/icons/walk.svg' />
        </div>
        <div className={styles.footer}>
            <button className="large-button">Calcola percorso</button>
        </div>
    </form>
    )
}