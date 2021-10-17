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
import MIPRoundedCheckbox from '../forms/MIPRoundedCheckbox'
import MIPAddressAutocompleteInput from './MIPAddressAutocompleteInput'
import { mipConcatenate } from '../../lib/MIPUtility';

const PATH_ORIGIN_ID = 'path_origin'
const PATH_DEST_ID = 'path_dest'
const optionData = [
    {
        id: 'pedestrian',
        title: 'a piedi',
        icon: '/icons/walk.svg',
        initialState: false
    },
    {
        id: 'vehicle',
        title: 'auto',
        icon: '/icons/car.svg',
        initialState: true
    },
    {
        id: 'public_transport',
        title: 'mezzi pubblici',
        icon: '/icons/bus.svg',
        initialState: false
    },
    {
        id: 'bike',
        title: 'bicicletta',
        icon: '/icons/bike.svg',
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
    const optionStates = optionData.map(option => ({
        ...option,
        stateData: useState(option.initialState)
    }))

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
    const onChangeOption = (id, newState) => {
        optionStates.forEach(state => state.stateData[1](state.id == id ? newState : false))
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
            <div className={styles.path_input}>
                <MIPAddressAutocompleteInput id={PATH_ORIGIN_ID} icon='/icons/path-start.svg' placeholder='Punto di partenza'
                    onChange={onChangeLocation} />
                <div className={styles.divisor}>
                    <img src="/icons/path-swap.svg" id='destination' alt="inverti partenza e destinazione" />
                </div>
                <MIPAddressAutocompleteInput id={PATH_DEST_ID} icon='/icons/path-dest.svg' placeholder='Punto di arrivo'
                    onChange={onChangeLocation} />
            </div>
            <div className={styles.button_bar_title}>Mostra percorso</div>
            <div className={styles.button_bar}>
                {optionStates.map(opt =>
                    <MIPRoundedCheckbox id={opt.id} title={opt.title} icon={opt.icon} checked={opt.stateData[0]}
                        onChange={onChangeOption} />
                )
                }
            </div>
            <RadioGroup className={styles.radio_group} value="on" onChange={onChangeOption} >
                <RadioGroup.Label className={styles.radio_group_label}>Mostra percorso</RadioGroup.Label>
                <div className={styles.button_bar}>
                <RadioGroup.Option value="startup" className={styles.radio_group_option + ' ' + styles.select}>
                    <RadioGroup.Label className={styles.radio_label}>a piedi</RadioGroup.Label>
                </RadioGroup.Option>
                <RadioGroup.Option className={styles.radio_group_option} value="enterprise">
                    <RadioGroup.Label className={styles.radio_label}>in bus</RadioGroup.Label>
                </RadioGroup.Option>
                <RadioGroup.Option value="business" className={styles.radio_group_option1}>
                    <img src="/icons/bus.svg"/>
                    {({ checked }) => (
                        <span className={checked ? 'bg-blue-200' : ''}>Business</span>
                    )}
                </RadioGroup.Option>
                </div>
            </RadioGroup>            <div className={styles.footer}>
                <input type="submit" className="mip-large-button" value="Calcola percorso" />
            </div>
        </form>
    )
}