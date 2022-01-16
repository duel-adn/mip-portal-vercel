/**
    Duel srl

    Controllo per l'input di indirizzi per il sistema di calcolo
    del percorso con funzioni di ricerca e completamento automatico.

    Revision history

    | Data       | Autore | Descrizione 
    | ---------- | ------ | ----------------------------------- |
    | 2021/10/14 | Duel   | Prima versione                      |
*/

import styles from './MIPPath.module.scss'
import { useState, useRef } from 'react';

import useTranslation from 'next-translate/useTranslation'
import { toast } from 'react-toastify';

import AsyncSelect from 'react-select/async';
import { mipGetUserPosition, mipPathAutocomplete } from '../../lib/MIPPlannerAPI';
import { mipConcatenate } from '../../lib/MIPUtility';
import { useList } from '../../lib/MIPHooks';
import MIPForms from '../forms/MIPForms';

/**
 * Styling per il box di input e il dropdown
 */
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

/**
 * Controllo per la scelta di località per il calcolo del percorso
 * con funzioni di ricerca e di completamento automatico.
 * 
 * @param {string} id id del div esterno
 * @param {string} placeholder testo del placeholder dell'input
 * @param {string} icon url dell'icona a sinistra del controllo
 * @param {string} onChange funzione da chiamare quando l'utente seleziona un'entry dal dropdown
 * 
 * @returns il componente pronto per l'uso
 */
export default function MIPAddressAutocompleteInput({ id, icon, placeholder, value, onChange, loadingMsg, label }) {
    const { t, lang } = useTranslation("planner")
    const [searchString, setSearchString] = useState(null)
    const [itemList, addItem] = useList()
    const toastId = useRef(null);

    const handleInputChange = (value) => setSearchString(value)
    const handleSelect = (location) => {
        if (onChange) {
            if (location != null) {
                addItem(location)
            }
            onChange(location)
        }
    }
    const getCurrentPosition = () => {
        toastId.current = toast(t("UserPosition"), { autoClose: false });
        mipGetUserPosition(lang, position => {
            if (position.error) {
                const message = t("error:" + position.error.mipErrorCode)
                toast.update(toastId.current, { type: toast.TYPE.ERROR, render: message, autoClose: 5000 })
            } else {
                toast.dismiss(toastId.current)
                onChange(position.locations[0])
            }
        })
    }
    const loadOptions = async (inputValue, callback) => {
        if (inputValue && inputValue.length < 2) {
            callback(itemList)
        } else {
            const rawData = await mipPathAutocomplete('it', inputValue)
            if (rawData instanceof Error) {
                // TODO: show error on control
                console.log('error' + rawData)
                return
            }
            console.log(rawData.locations)
            callback(rawData.locations)
        }
    }
    return (
        <>
        <img className={styles.icon} src={icon} aria-hidden={true} alt={label}/>
        <AsyncSelect
            styles={customStyles}
            placeholder={placeholder}
            loadOptions={loadOptions}
            loadingMessage={() => loadingMsg ?? "Loading..."}
            defaultOptions={itemList}
            isClearable
            onInputChange={handleInputChange}
            onChange={handleSelect}
            value={value}
            noOptionsMessage={() => searchString?.length < 3 ?
                t("SupplyAddress") : t("NoAddress")}
            menuShouldScrollIntoView={true}
            aria-label={label}
            inputId={id}
            instanceId={id + "-select"}
        />
        <MIPForms.IconButton icon="/icons/position.svg" 
            label={t("UseUserPosition")} 
            onClick={() => getCurrentPosition()}/>
        </>
    )
}
