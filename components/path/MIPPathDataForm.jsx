/**
    Duel srl

    Form per l'input dei dati per la ricerca del percorso.

    Revision history

    | Data       | Autore | Descrizione 
    | ---------- | ------ | ----------------------------------- |
    | 2021/08/10 | Duel   | Prima versione                      |
*/

import { useState } from 'react';
import { RadioGroup } from '@headlessui/react'
import styles from './MIPPath.module.scss'
import MIPAddressAutocompleteInput from './MIPAddressAutocompleteInput'
import { mipConcatenate } from '../../lib/MIPUtility';

const PATH_ORIGIN_ID = 'path_origin'
const PATH_DEST_ID = 'path_dest'
const optionData = [
    {
        id: 'vehicle',
        title: 'auto',
        icon: styles.car,
        value: "CAR",
        initialState: true
    },
    {
        id: 'public_transport',
        title: 'mezzi pubblici',
        value: "PUBLIC",
        icon: styles.bus,
        initialState: false
    },
    {
        id: 'bike',
        title: 'bicicletta',
        value: "BIKE",
        icon: styles.bike,
        initialState: false
    },
    {
        id: 'pedestrian',
        title: 'a piedi',
        icon: styles.walk,
        value: "WALK",
        initialState: false
    },
]

/**
 * Form per l'inserimento dei dati relativi al percorso da calcolare
 * 
 * @param {string} className nome da aggiungere all'elemento esterno
 * @param {(location, location) => void} callback per il calcolo del percorso
 * @returns il componente per l'inserimento dati
 */
export default function MIPPathDataForm({ className, onSubmit }) {
    const [startLocation, setStartLocation] = useState(null)
    const [endLocation, setEndLocation] = useState(null)
    const [selectedOption, setSelectedOption] = useState(optionData[0])

    const onChangeLocation = (id, location) => {
        switch (id) {
            case PATH_ORIGIN_ID:
                setStartLocation(location)
                break

            case PATH_DEST_ID:
                setEndLocation(location)
                break

            default:
                console.log(`Invalid id for path endpoint: ${id}`)
        }
    }
    const pathSearch = async (event) => {
        if (!startLocation) {
            alert("No start location")
            return
        } else if (!endLocation) {
            alert("No end location")
            return
        }
        event.stopPropagation()
        event.preventDefault()
        if (onSubmit) {
            onSubmit(startLocation, endLocation)
        }
    }
    return (
        <form className={mipConcatenate(className, styles.path_data_dialog)} onSubmit={pathSearch}>
            <div className={styles.path_input_container}>
                <MIPAddressAutocompleteInput id={PATH_ORIGIN_ID} className={styles.input} icon='/icons/path-start.svg' placeholder='Punto di partenza'
                    onChange={onChangeLocation} />
                <div className={styles.divisor}>
                    <input type="button" className={styles.swap_button} />
                </div>
                <MIPAddressAutocompleteInput id={PATH_DEST_ID} className={styles.input} icon='/icons/path-dest.svg' placeholder='Punto di arrivo'
                    onChange={onChangeLocation} />
            </div>
            <RadioGroup className={styles.radio_group_container} value={selectedOption} onChange={setSelectedOption} >
                <RadioGroup.Label className={styles.label}>Mostra percorso</RadioGroup.Label>
                <div className={styles.radio_group}>
                    {optionData.map(opt => 
                        <RadioGroup.Option key={opt.id}
                            value={opt} 
                            className={({ active, checked }) => mipConcatenate(styles.option, opt.icon,
                                active ? styles.active : '',
                                checked ?  styles.checked : '')}>
                            <RadioGroup.Label className={styles.radio_label}>{opt.title}</RadioGroup.Label>
                        </RadioGroup.Option>
                    )}
                </div>
            </RadioGroup>            
            <div className={styles.footer}>
                <input type="submit" className="mip-large-button" value="Calcola percorso" />
            </div>
        </form>
    )
}