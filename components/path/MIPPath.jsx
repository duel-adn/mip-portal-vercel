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
import { MIPPlanMode, MIPDateOption, MIPBikeOptions, mipPathSearch, mipPathSearchQuery, otp2MipMode } from '../../lib/MIPPlannerAPI';
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
                coordinates: { lng: Number(coords[1]), lat: Number(coords[0]) }
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
    const [planDateOption, setPlanDateOption] = useState(MIPDateOption.START_NOW)
    const [planDate, setPlanDate] = useState(Date.now() + 5 * 60000)
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
                        planMode, planMode == MIPPlanMode.TRANSIT ? planDate : null,
                        bikeOptions, true)
                })
            } else {
                const newPlan = await mipPathSearch(lang, startLocation.label, startLocation.coordinates,
                    endLocation.label, endLocation.coordinates,
                    planMode, planMode == MIPPlanMode.TRANSIT ? planDate : null,
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
        planDateOption, setPlanDateOption,
        planDate, setPlanDate,
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
            toast.error(t("MissingStart"), { toastId: "no-start-error" })
        } else if (!endLocation) {
            toast.error(t("MissingEnd"), { toastId: "no-end-error" })
        } else {
            if (recalcPathPlan) {
                recalcPathPlan(lang)
            }
        }
    }
    return (
        <form className={mipConcatenate(className, styles.path_data_dialog, responsive ? styles.responsive : undefined)}
            onSubmit={onPathSearch}>
            <MIPForms.IconTitle className={styles.title} icon="/icons/path-search.svg" title={title} />
            <div className={styles.path_data_panel}>
                <MIPAddressAutocompleteInput id="start-position"
                    label={t("StartLabel")}
                    icon="icons/path-start.svg"
                    searchString={startLocation?.label}
                    placeholder={t("StartPlaceholder")} loadingMsg={t("Loading")}
                    onChange={setStartLocation} value={startLocation} />
                <div className={styles.input_separator} />
                <MIPForms.IconButton icon="/icons/path-swap.svg" onClick={swapLocations} label="scambia" />
                <MIPAddressAutocompleteInput id="start-position"
                    label={t("EndLabel")}
                    icon="icons/path-dest.svg"
                    searchString={endLocation?.label}
                    placeholder={t("EndPlaceholder")} loadingMsg={t("Loading")}
                    onChange={setEndLocation} value={endLocation} />
                <MIPPathOptions planMode={planMode} setPlanMode={setPlanMode} />
                <MIPTransitOptions mode={planMode} />
                {planning ?
                    <MIPForms.Loading className={styles.loading_indicator} />
                    :
                    <input className={styles.submit_button} type="submit" value={t("Submit")} />
                }
            </div>
        </form>
    )
}

// toISOString riporta la data in GMT, quindi bisogna aggiustare la data passata
// come argomento per "ingannarlo"
function toISODate(d) {
    return d ? new Date(d - 60000 * d.getTimezoneOffset()).toISOString().slice(0, -8) : null
}

function mipISODate(d) {
    const date = new Date(d)
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
}

function AdditionalOptions() {
    const { t } = useTranslation("planner")
    const {
        planMode,
        planDateOption, setPlanDateOption,
        planDate, setPlanDate,
        bikeOptions, setBikeOptions,
    } = useContext(MIPPlannerContext)
    const datePickerRef = useRef(null)
    useEffect(() => {
        if (datePickerRef.current) {
            datePickerRef.current.value = mipISODate(planDate)
            console.log(datePickerRef.current.value)
        }
    }, [])
    return (
        <div className={styles.path_options}>
            {planMode == MIPPlanMode.TRANSIT && <>
                <div className={styles.additional_options}>
                    <select value={planDateOption} onChange={e => setPlanDateOption(e.target.value)}>
                        {Object.values(MIPDateOption).map(k =>
                            <option key={k} value={k}>{t("DateOption." + k)}</option>
                        )}
                    </select>
                </div>
                {planDateOption !== MIPDateOption.START_NOW &&
                    <div className={styles.additional_options}>
                        <input ref={datePickerRef} id="start-date-picker" type="date"
                            onChange={e => setPlanDate
                                (new Date(e.target.value))}
                        />
                        <input id="start-time-picker" type="time"
                            onChange={e => setPlanDate
                                (new Date(e.target.value))}
                        />
                    </div>
                }
            </>}
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
        </div >
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

function MIPTransitOptions() {
    const { t } = useTranslation("planner")
    const {
        planMode,
        planDateOption, setPlanDateOption,
        planDate, setPlanDate,
    } = useContext(MIPPlannerContext)
    return (planMode === MIPPlanMode.TRANSIT ? <>
        <div className={styles.additional_options}>
            <select id="plan-date" value={planDateOption} onChange={e => setPlanDateOption(e.target.value)}>
                {Object.values(MIPDateOption).map(k =>
                    <option key={k} value={k}>{t("DateOption." + k)}</option>
                )}
            </select>
        </div>
        {planDateOption !== MIPDateOption.START_NOW &&
            <div className={styles.additional_options}>
                <input id="start-time-picker" type="time"
                    onChange={e => setPlanDate
                        (new Date(e.target.value))}
                />
                <input id="start-date-picker" type="date"
                    onChange={e => setPlanDate(e.target.valueAsNumber)}
                    value={new Date(planDate).toISOString().slice(0, 10)}
                />
            </div>}
    </> : null)
}

const MIPPath = {
    Context: MIPPlannerContext,
    Controller: MIPPathController,
    DataForm: MIPPathDataForm
}

export default MIPPath