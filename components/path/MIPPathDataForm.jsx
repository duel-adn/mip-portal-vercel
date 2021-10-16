/**
    Duel S.p.A.

    Form per l'input dei dati per la ricerca del percorso.

    Revision history

    | Data       | Autore | Descrizione 
    | ---------- | ------ | ----------------------------------- |
    | 2021/08/10 | Duel   | Prima versione                      |
*/

import styles from './MIPPath.module.scss';
import { useMemo, useState } from 'react'
import { debounce } from '../../lib/MIPUtility'
import MIPRoundedCheckbox from '../forms/MIPRoundedCheckbox';
import AsyncSelect from 'react-select/async';
import { mipPathAutocomplete } from './MIPPathAPI';

const url = "https://map.muoversinpiemonte.it/autocomplete?lang=it&text="
async function autocomplete(input) {
    if (input.length > 3) {
        const completeUrl = url + input
        const rawData = await fetch(completeUrl)
        const data = await rawData.json()
        return data.features.map(feature => {
            return {
                input: input,
                id: feature.properties.id,
                name: feature.properties.label,
                coordinates: feature.geometry.coordinates
            }
        })
    }
    return []
}

function InputWithIcon({ id, placeholder, icon }) {
    const [value, setValue] = useState({})
    const [items, setItems] = useState([])
    async function onChange(e) {
        const items = await autocomplete(e.target.value)
        setItems(items)
        setValue(e.target.value)
    }
    const deboucedOnChange = useMemo(() =>
        debounce(onChange, 500), [])
    return (
        <div className={styles.input}>
            <img src={icon} />
            <input type="text" list={id}
                placeholder={placeholder} onChange={deboucedOnChange} />
            <datalist id={id} onChange={(e) => console.log(e)}>
                {items && items.map((item, index) =>
                    <option key={item.id} onSelect={() => console.log(item)}>{item.name}</option>
                )}
            </datalist>

        </div>
    )
}

const customStyles = {
    option: (provided, state) => ({
        ...provided,
        color: '#222',
        //backgroundColor: state.isFocused ? '#368CF7' : 'white',
    }),
    container: (provided) => ({
        ...provided,
        width: '100%'
    }),
    control: (provided) => ({
        // none of react-select's styles are passed to <Control />
        ...provided,
        backgroundColor: 'transparent',
        color: 'white',
        border: 'none',
        borderBottom: '1px solid white',
        borderRadius: 0,
    }),
    placeholder: (provided) => ({
        ...provided,
        color: 'white',
        fontWeight: 300
    }),
    input: (provided) => ({
        ...provided,
        color: 'white',
    }),
    clearIndicator: (provided) => ({
        ...provided,
        color: 'lightgray',
        ':hover': {
            color: 'white'
        }
    }),
    dropdownIndicator: (provided) => ({
        ...provided,
        color: 'lightgray',
        ':hover': {
            color: 'white'
        }
    }),
    indicatorSeparator: (provided) => ({
        ...provided,
        backgroundColor: 'transparent'
    }),
    singleValue: (provided, state) => {
        const opacity = state.isDisabled ? 0.5 : 1;
        const transition = 'opacity 300ms';

        return { ...provided, color: 'white', opacity, transition };
    }
}

function AutocompleteAddressInput({id, placeholder, icon, onChange}) {
    const [searchString, setSearchString] = useState("")
    const [location, setLocation] = useState(null)

    const handleInputChange = (value) => setSearchString(value)
    const handleSelect = (location) => {
        if (onChange) {
            onChange(id, location)
        }
        setLocation(location)
        console.log(location)
    }

    const loadOptions = async (inputValue, callback) => {
        const rawData = await mipPathAutocomplete('it', inputValue)
        if (rawData instanceof Error) {
            console.log('error' + rawData)
            return
        }
        callback(rawData)
    }
    return  (
        <div id={id} className={styles.input}>
        <img src={icon} />
        <AsyncSelect 
            styles={customStyles}
            placeholder={placeholder}
            loadOptions={loadOptions}
            defaultOptions
            isClearable
            onInputChange={handleInputChange}
            onChange={handleSelect}
            noOptionsMessage={() => searchString.length < 3 ? "Digitare un indirizzo" : "Località non trovata"}
            menuShouldScrollIntoView={true}
        />
    </div>
    )
}

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
    const pathSearch = (event) =>{
        if (!startLocation) {
            alert("No start location")
        } else if (!endLocation) {
            alert("No end location")
        }
        event.preventDefault()
    }
    return (
        <form className={`${props.className} ${styles.path_data_dialog}`}>
            <div className={styles.path_input}>
                <AutocompleteAddressInput id={PATH_ORIGIN_ID} icon='/icons/path-start.svg' placeholder='Punto di partenza' 
                    onChange={onChangeLocation} />
                <div className={styles.divisor}>
                    <img src="/icons/path-swap.svg" id='destination' alt="inverti partenza e destinazione" />
                </div>
                <AutocompleteAddressInput id={PATH_DEST_ID} icon='/icons/path-dest.svg' placeholder='Punto di arrivo' 
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