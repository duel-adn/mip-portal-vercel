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
import Router from 'next/router'

import { RadioGroup } from '@headlessui/react'
import { toast } from 'react-toastify';

import useTranslation from 'next-translate/useTranslation'
import MIPAddressAutocompleteInput from './MIPAddressAutocompleteInput'

import { mipCreateId, mipConcatenate } from '../../lib/MIPUtility';
import { MIPPlanMode, MIPBikeOptions, mipPathSearch, mipPathSearchQuery, otp2MipMode } from '../../lib/MIPPlannerAPI';
import MIPForms from '../forms/MIPForms';

const initialContext = {
    plan: null
}

const MIPPlannerContext = createContext(initialContext)

function parseLocation(loc) {
    if (typeof loc !== 'string') {
        return null
    }
    const components = loc.split("::")
    if (components.length === 2) {
        const name = decodeURI(components[0])
        const coords = components[1].split(",")
        if (coords.length === 2) {
            const id = mipCreateId()
            return {
                id: id,
                value: id,
                label: name,
                name: name,
                coordinates: {lng: Number(coords[1]), lat: Number(coords[0])}
            }
        }
    }
    return null
}

function MIPPathController({ children, query, url }) {
    const { lang } = useTranslation("planner")
    const initialStartLocation = parseLocation(query?.fromPlace)
    const initialEndLocation = parseLocation(query?.toPlace)
    const initialMode = otp2MipMode(query?.mode)
    const [plan, setPlan] = useState(null)
    const [planning, setPlanning] = useState(false)
    const [startLocation, setStartLocation] = useState(initialStartLocation)
    const [endLocation, setEndLocation] = useState(initialEndLocation)
    const [planMode, setPlanMode] = useState(initialMode)
    const [startDate, setStartDate] = useState(null)
    const [bikeOptions, setBikeOptions] = useState(MIPBikeOptions.safe)
    const [map, setMap] = useState(null)
    const [selectedItinerary, setSelectedItinerary] = useState(null)
    const swapLocations = () => {
        const temp = startLocation
        setStartLocation(endLocation)
        setEndLocation(temp)
    }
    const recalcPathPlan = async (lang) => {
        setPlanning(true)
        setPlan(null)
        setSelectedItinerary(null)
        try {
            if (url) {
                Router.push({
                    pathname: url,
                    query: mipPathSearchQuery(lang, startLocation.label, startLocation.coordinates,
                        endLocation.label, endLocation.coordinates,
                        planMode, planMode == MIPPlanMode.TRANSIT ? startDate : null,
                        bikeOptions, true)
                })
            } else {
                const newPlan = await mipPathSearch(lang, startLocation.label, startLocation.coordinates,
                    endLocation.label, endLocation.coordinates,
                    planMode, planMode == MIPPlanMode.TRANSIT ? startDate : null,
                    bikeOptions, true)
                console.log(newPlan)
                setPlan(newPlan)
            }
        } catch (exc) {
            console.log(exc)
        }
        setPlanning(false)
    }
    useEffect(() => {
        if (plan?.mbr && map) {
            map?.fitBounds(plan.mbr)
        }
    }, [plan])
    const context = {
        plan, planning,
        startLocation, setStartLocation,
        endLocation, setEndLocation,
        planMode, setPlanMode,
        startDate, setStartDate,
        bikeOptions, setBikeOptions,
        selectedItinerary, setSelectedItinerary,
        swapLocations, recalcPathPlan,
        setMap
    }
    useEffect(() => {
        if (initialStartLocation && initialEndLocation) {
            recalcPathPlan(lang)
        }
    }, [])
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
        planning, swapLocations, recalcPathPlan
    } = useContext(MIPPlannerContext)
    const { t, lang } = useTranslation("planner")
    function onPathSearch(event) {
        event.preventDefault()
        event.stopPropagation()
        if (!startLocation) {
            toast.error(t("MissingStart"), {toastId: "no-start-error"})
        } else if (!endLocation) {
            toast.error(t("MissingEnd"), {toastId: "no-end-error"})
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
                <MIPAddressAutocompleteInput id="start-position"
                    className={styles.input}
                    label={t("StartLabel")}
                    searchString={startLocation?.label}
                    icon='/icons/path-start.svg'
                    placeholder={t("StartPlaceholder")} loadingMsg={t("Loading")}
                    onChange={setStartLocation} value={startLocation} />
                <MIPAddressAutocompleteInput id="start-position"
                    className={styles.input}
                    label={t("EndLabel")}
                    searchString={endLocation?.label}
                    icon='/icons/path-dest.svg'
                    placeholder={t("EndPlaceholder")} loadingMsg={t("Loading")}
                    onChange={setEndLocation} value={endLocation} />
                <div className={styles.input_separator} />
                <button type="button" onClick={swapLocations} className={styles.swap_button} aria-label="scambia" />
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
            {planMode == MIPPlanMode.TRANSIT &&
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
            {planMode == MIPPlanMode.BICYCLE &&
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
                {Object.values(MIPPlanMode).map(value =>
                    <RadioGroup.Option key={value}
                        value={value}
                        className={({ active, checked }) => mipConcatenate(styles.option,
                            active ? styles.active : '',
                            checked ? styles.checked : '')
                        }>
                        <img className={styles.icon} aria-hidden="true"
                            src={`/path-icons/mode-${value.toLowerCase()}.svg`} alt={t(`ModeLabel.${value}`)} />
                        <RadioGroup.Label className={styles.radio_label}>{t(`ModeLabel.${value}`)}</RadioGroup.Label>
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