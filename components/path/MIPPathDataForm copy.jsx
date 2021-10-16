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
import Autosuggest from 'react-autosuggest';
import Select from 'react-select'
import AsyncSelect from 'react-select/async';

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

const loadOptions = async (inputValue, callback) => {
    const rawData = await autocomplete(inputValue)
    console.log(rawData)
    const data = rawData.map(d => {
        return { value: d.name, label: d.name, isFixed: true }
    })
    console.log({options: data})
    callback(data)
};

const InputWithAutoselect = (props) => {
    const [location, setLocation] = useState("")
    const [suggestions, setSuggestions] = useState([])
    const handleInputChange = (newValue) => {
        const inputValue = newValue.replace(/\W/g, '');
        setLocation({ inputValue });
        return inputValue;
    };
    return <AsyncSelect 
        placeholder="Inserisci indirizzo"
        loadOptions={loadOptions}
        defaultOptions
        isClearable
        onInputChange={handleInputChange}
    />
}

const getSuggestionValue = suggestion => suggestion.name;

// Use your imagination to render suggestions.
const renderSuggestion = suggestion => (
    <div>
      {suggestion.name}
    </div>
  );
  
function AutocompleteInput() {
    const [location, setLocation] = useState("")
    const [suggestions, setSuggestions] = useState([])
    const onSuggestionsFetchRequested = async ({ value }) => {
        const items = await autocomplete(value)
        
        setSuggestions(items)
    };
    // Autosuggest will call this function every time you need to clear suggestions.
    const onSuggestionsClearRequested = () => {
        setSuggestions([])
    };

    const onChange = (event, { newValue }) => {
        console.log("setting location " + newValue);
        setLocation(newValue)
    }

    const inputProps = {
        placeholder: 'Type a programming language',
        value: location,
        onChange: onChange
      };
    return (
        <Autosuggest
            suggestions={suggestions}
            onSuggestionsFetchRequested={onSuggestionsFetchRequested}
            onSuggestionsClearRequested={onSuggestionsClearRequested}
            getSuggestionValue={getSuggestionValue}
            renderSuggestion={renderSuggestion}
            inputProps={inputProps}
        />
    );
}

export default function MIPPathDataForm(props) {
    return (
        <form className={`${props.className} ${styles.path_data_dialog}`}>
            <div className={styles.path_input}>
                <AutocompleteInput value="" id='start' icon='/icons/path-start.svg' placeholder='Punto di partenza' />
                <div className={styles.divisor}>
                    <img src="/icons/path-swap.svg" id='destination' alt="inverti partenza e destinazione" />
                </div>
                {/* <InputWithIcon id='path_end' icon='/icons/path-dest.svg' placeholder='Punto di arrivo' /> */}
                <InputWithAutoselect />
            </div>
            <div className={styles.button_bar_title}>Mostra percorso</div>
            <div className={styles.button_bar}>
                <MIPRoundedCheckbox title="auto" icon='/icons/car.svg' checked={true} />
                <MIPRoundedCheckbox title="mezzi pubblici" icon='/icons/bus.svg' />
                <MIPRoundedCheckbox title="bicicletta" icon='/icons/bike.svg' />
                <MIPRoundedCheckbox title="a piedi" icon='/icons/walk.svg' />
            </div>
            <div className={styles.footer}>
                <button className="mip-large-button">Calcola percorso</button>
            </div>
        </form>
    )
}