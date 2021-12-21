/**
    Duel S.p.A.

    Elementi interfaccia pianificazione viaggio

    Revision history

    | Data       | Autore | Descrizione 
    | ---------- | ------ | ----------------------------------- |
    | 2021/08/10 | Duel   | Prima versione                      |
*/
import styles from './MIPPath.module.scss'

import { createContext, useContext, useState, useRef, useEffect } from 'react';
import { RadioGroup } from '@headlessui/react'

import useTranslation from 'next-translate/useTranslation'
import MIPAddressAutocompleteInput from './MIPAddressAutocompleteInput'

import { mipConcatenate } from '../../lib/MIPUtility';
import { MIPPlanMode, MIPBikeOptions, mipPathSearch } from './MIPPathAPI';
import MIPForms from '../forms/MIPForms';

const initialContext = {
    plan: null
}

const MIPPlannerContext = createContext(initialContext)

function MIPPathController({ children }) {
    const [plan, setPlan] = useState(false)
    const [planning, setPlanning] = useState(false)
    const [startLocation, setStartLocation] = useState(null)
    const [endLocation, setEndLocation] = useState(null)
    const [planMode, setPlanMode] = useState(MIPPlanMode.transit)
    const [startDate, setStartDate] = useState(null)
    const [bikeOptions, setBikeOptions] = useState(MIPBikeOptions.safe)
    const [map, setMap] = useState(null)
    const recalcPathPlan = async (lang) => {
        setPlanning(true)
        try {
            const newPlan = await mipPathSearch(lang, startLocation.label, startLocation.coordinates,
                endLocation.label, endLocation.coordinates,
                planMode, planMode == MIPPlanMode.transit ? startDate : null,
                bikeOptions, true)
            console.log(newPlan)
            setPlan(newPlan)
            const newBounds = [[newPlan.mbr[0][1], newPlan.plan?.mbr[0][0]], [newPlan.plan?.mbr[1][1], newPlan.plan?.mbr[1][0]]]
            map?.fitBounds(newPlan.mbr)
        } catch (exc) {
            console.log(exc)
        }
        setPlanning(false)
    }
    const context = {
        plan, planning,
        startLocation, setStartLocation,
        endLocation, setEndLocation,
        planMode, setPlanMode,
        startDate, setStartDate,
        bikeOptions, setBikeOptions,
        recalcPathPlan,
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
        startLocation, setStartLocation,
        endLocation, setEndLocation,
        planMode, setPlanMode,
        planning, recalcPathPlan
    } = useContext(MIPPlannerContext)
    const { t, lang } = useTranslation("planner")
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
                recalcPathPlan(lang)
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
            <MIPPathOptions planMode={planMode} setPlanMode={setPlanMode} />
            {!responsive &&
                <AdditionalOptions mode={planMode} />
            }
            {planning ?
                <MIPForms.Loading className={styles.loading_indicator} />
                :
                <input className={styles.submit_button} type="submit" value={t("Submit")} />
            }
        </form>
    )
}

// toISOString riporta la data in GMT, quindi bisogna aggiustare la data passata
// come argomento per "ingannarlo"
function toISODate(d) {
    return d ? new Date(d - 60000 * d.getTimezoneOffset()).toISOString().slice(0, -8) : null
}

function AdditionalOptions() {
    const { t } = useTranslation("planner")
    const {
        planMode,
        startDate, setStartDate,
        bikeOptions, setBikeOptions,
    } = useContext(MIPPlannerContext)
    const datePickerRef = useRef(null)
    useEffect(() => {
        if (datePickerRef.current) {
            if (!datePickerRef.current?.value) {
                datePickerRef.current.value = toISODate(new Date())
            }
        }
    }, [startDate])
    return (
        <div >
            {planMode == MIPPlanMode.transit &&
                <div className={styles.additional_options}>
                    <label htmlFor="start-time-picker">{t("StartTime")}</label>
                    {startDate &&
                        <input ref={datePickerRef} id="start-time-picker" type="datetime-local"
                            onChange={e => setStartDate
                                (new Date(e.target.value))}
                        />
                    }
                    <button className={styles.date_toggle} type="button"
                        onClick={() => setStartDate(startDate ? null : Date.now() + 5 * 60000)}
                    >{t("Now")}</button>
                </div>
            }
            {planMode == MIPPlanMode.bicycle &&
                <div className={styles.additional_options}>
                    <label htmlFor="bike-option-selector">{t("BikePathTypeTitle")}</label>
                    <select value={bikeOptions} onChange={e => setBikeOptions(e.target.value)}>
                        {Object.keys(MIPBikeOptions).map(opt =>
                            <option key={opt} value={opt}>{t(`BikePathType.${opt}`)}</option>
                        )}
                    </select>
                </div>
            }
        </div>
    )
}

function MIPPathOptions({ planMode, setPlanMode }) {
    const { t } = useTranslation("planner")
    return (
        <RadioGroup className={styles.path_options} value={planMode}
            onChange={setPlanMode} >
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