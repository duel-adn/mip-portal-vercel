/**
    Duel S.p.A.

    Form per l'input dei dati per la ricerca del percorso.

    Revision history

    | Data       | Autore | Descrizione 
    | ---------- | ------ | ----------------------------------- |
    | 2021/08/10 | Duel   | Prima versione                      |
*/

import { useState } from 'react';
import styles from './MIPPath.module.scss'
import MIPRoundedCheckbox from '../forms/MIPRoundedCheckbox'
import MIPAddressAutocompleteInput from './MIPAddressAutocompleteInput'
import { mipPathSearch } from './MIPPathAPI'

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


export default function MIPPathDataForm(props) {
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
    const pathSearch = async (event) =>{
        if (!startLocation) {
            alert("No start location")
        } else if (!endLocation) {
            alert("No end location")
        }
        event.preventDefault()
        const response = await mipPathSearch('it', startLocation.name, startLocation.coordinates, endLocation.name, endLocation.coordinates)
        console.log(response)
    }
    return (
        <form className={`${props.className} ${styles.path_data_dialog}`}>
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
                { optionStates.map(opt => 
                    <MIPRoundedCheckbox id={opt.id} title={opt.title} icon={opt.icon} checked={opt.stateData[0]}
                        onChange={onChangeOption}/>
                    )
                }
            </div>
            <div className={styles.footer}>
                <button className="mip-large-button" onClick={pathSearch}>Calcola percorso</button>
            </div>
        </form>
    )
}