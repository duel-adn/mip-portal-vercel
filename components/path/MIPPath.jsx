/**
    Duel S.p.A.

    Elementi interfaccia pianificazione viaggio

    Revision history

    | Data       | Autore | Descrizione 
    | ---------- | ------ | ----------------------------------- |
    | 2021/08/10 | Duel   | Prima versione                      |
*/
import styles from './MIPPath.module.scss'

import { createContext, useContext, useState } from 'react';
import { RadioGroup } from '@headlessui/react'

import useTranslation from 'next-translate/useTranslation'
import MIPAddressAutocompleteInput from './MIPAddressAutocompleteInput'

import { mipConcatenate } from '../../lib/MIPUtility';
import { MIPPlanMode, mipPathSearch } from './MIPPathAPI';
import MIPForms from '../forms/MIPForms';

const initialContext = {
    plan: null
}

const MIPPlannerContext = createContext(initialContext)

function MIPPathController({ children }) {
    const [plan, setPlan] = useState(false)
    const [planning, setPlanning] = useState(false)
    const [map, setMap] = useState(null)
    //function recalcPathPlan() { console.log()}
    const recalcPathPlan = async (lang, startLocation, startCoords, endLocation, endCoords, mode) => {
        setPlanning(true)
        try {
            const newPlan = await mipPathSearch(lang, startLocation, startCoords,
                endLocation, endCoords,
                mode, true)
            console.log(newPlan)
            setPlan(newPlan)
        } catch (exc) {
            console.log(exc)
        }
        setPlanning(false)
    }
    const context = {
        plan, planning, recalcPathPlan,
        setMap
    }
    return (
        <MIPPlannerContext.Provider value={context}>
            {children}
        </MIPPlannerContext.Provider>
    )
}

function MIPPathDataForm({ className, title, responsive }) {
    const {
        plan, planning, recalcPathPlan
    } = useContext(MIPPlannerContext)
    const { t, lang } = useTranslation("planner")
    const [startLocation, setStartLocation] = useState(null)
    const [endLocation, setEndLocation] = useState(null)
    const [selectedOption, setSelectedOption] = useState(MIPPlanMode.transit)
    function onPathSearch(event) {
        event.preventDefault()
        event.stopPropagation()
        if (!startLocation) {
            // TODO: improve 
            alert(t("MissingStart"))
        } else if (!endLocation) {
            alert(t("MissingEnd"))
        } else {
            if (recalcPathPlan) {
                recalcPathPlan(lang, startLocation.label, startLocation.coordinates, endLocation.label, endLocation.coordinates, selectedOption)
            }
        }
    }
    return (
        <form className={mipConcatenate(className, styles.path_data_dialog, responsive ? styles.responsive : undefined)}
            onSubmit={onPathSearch}>
            {title &&
                <h3 className={styles.title}>{title}</h3>
            }
            <div className={styles.endpoint_data_container}>
                <MIPAddressAutocompleteInput className={styles.input}
                    icon='/icons/path-start.svg'
                    placeholder={t("StartPlaceholder")} loadingMsg={t("Loading")}
                    onChange={setStartLocation} />
                <MIPAddressAutocompleteInput className={styles.input}
                    icon='/icons/path-dest.svg'
                    placeholder={t("EndPlaceholder")} loadingMsg={t("Loading")}
                    onChange={setEndLocation} />
                <div className={styles.input_separator} />
                <button className={styles.swap_button} />
            </div>
            <MIPPathOptions selectedOption={selectedOption} setSelectedOption={setSelectedOption} />
            {!responsive &&
                <AdditionalOptions mode={selectedOption} />
            }
            {planning ?
                <MIPForms.Loading className={styles.loading_indicator} />
                :
                <input className={styles.submit_button} type="submit" value={t("Submit")} />
            }
        </form>
    )
}

function AdditionalOptions({ mode }) {
    const { t } = useTranslation("planner")
    const [startDate, setStartDate] = useState(Date.now() + 5 * 60000)
    const adjustedDate = new Date(startDate)
    // toISOString riporta la data in GMT, quindi bisogna aggiustare la data passata
    // come argomento per "ingannarlo"
    const isoDate = new Date(startDate - 60000 * adjustedDate.getTimezoneOffset()).toISOString().slice(0, -8)
    return (
        <div >
            {mode == MIPPlanMode.transit &&
                <div className={styles.additional_options}>
                    <label htmlFor="start-time-picker">{t("StartTime")}</label>
                    <input id="start-time-picker" type="datetime-local"
                        min={isoDate} value={isoDate}
                        onChange={e => setStartDate
                            (new Date(e.target.value))}
                    />
                </div>
            }
            {mode == MIPPlanMode.bicycle &&
                <div className={styles.additional_options}>
                    <label htmlFor="bike-option-selector">{t("BikePathType")}</label>
                    <select>
                        <option value="a">{t("BikePathTypeSafe")}</option>
                        <option value="B">{t("BikePathTypeEasy")}</option>
                        <option value="C">{t("BikePathTypeFast")}</option>
                    </select>
                </div>
            }
        </div>
    )
}

function MIPPathOptions({ selectedOption, setSelectedOption }) {
    const { t } = useTranslation("planner")
    return (
        <RadioGroup className={styles.path_options} value={selectedOption}
            onChange={setSelectedOption} >
            <RadioGroup.Label className={styles.label}>{t("PlanType")}</RadioGroup.Label>
            <div className={styles.radio_group}>
                {Object.keys(MIPPlanMode).map(key =>
                    <RadioGroup.Option key={key}
                        value={MIPPlanMode[key]}
                        className={({ active, checked }) => mipConcatenate(styles.option,
                            active ? styles.active : '',
                            checked ? styles.checked : '')
                        }>
                        <img className={styles.icon}
                            src={`/path-icons/mode-${key}.svg`} alt={MIPPlanMode[key]} />
                        <RadioGroup.Label className={styles.radio_label}>{t("ModeLabel." + key)}</RadioGroup.Label>
                    </RadioGroup.Option>
                )}
            </div>
        </RadioGroup>
    )
}

const MIPPath = {
    Context: MIPPlannerContext,
    Controller: MIPPathController,
    DataForm: MIPPathDataForm
}

export default MIPPath