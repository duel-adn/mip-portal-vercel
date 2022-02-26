/**
    Duel S.p.A.

    Elementi interfaccia pianificazione viaggio

    Revision history

    | Data       | Autore | Descrizione 
    | ---------- | ------ | ----------------------------------- |
    | 2021/08/10 | Duel   | Prima versione                      |
*/
import styles from './MIPPath.module.scss'

import { createContext, useContext, useState, useEffect } from 'react'
import Router from 'next/router'

import { RadioGroup } from '@headlessui/react'
import { toast } from 'react-toastify';

import useTranslation from 'next-translate/useTranslation'
import MIPAddressAutocompleteInput from './MIPAddressAutocompleteInput'

import { mipConcatenate } from '../../lib/MIPUtility'
import { MIPPlanMode, MIPDateOption, MIPBikeOptions, mipPathSearch, mipPathSearchQuery, mipParseOtpLocation, otp2MipMode, mipOTPParseBicycleOptions } from '../../lib/MIPPlannerAPI';
import MIPForms from '../forms/MIPForms';
import { toISOLocalDate, toISOLocalTime } from "../../lib/MIPI18N"
import { useDateTime } from "../../lib/MIPHooks"

// Contesto del planner, usato dai componenti interni

const MIPPlannerContext = createContext({ plan: null })

/**
 * Componente headless per il controllo dell'interfaccia del 
 * trip planner
 * 
 * @param {[Object]} children componenti interni 
 * @param {Object} query parametri nella url
 * @param {String} url url della pagina da invocare per la pianificazione
 * @returns 
 */
function MIPPathController({ children, query, url }) {
    const { t, lang } = useTranslation("planner")
    const unnamedLocation = t("UnnamedLocation")
    const initialStartLocation = mipParseOtpLocation(query?.fromPlace, unnamedLocation)
    const initialEndLocation = mipParseOtpLocation(query?.toPlace, unnamedLocation)
    const initialMode = otp2MipMode(query?.mode)
    const [plan, setPlan] = useState(null)
    const [planning, setPlanning] = useState(false)
    const [startLocation, setStartLocation] = useState(initialStartLocation)
    const [endLocation, setEndLocation] = useState(initialEndLocation)
    const [planMode, setPlanMode] = useState(initialMode)
    const [planDateOption, setPlanDateOption] = useState(MIPDateOption.START_NOW)
    const [planDate, setPlanDate, updatePlanDate, updatePlanTime] = useDateTime(Date.now() + 5 * 60000)
    const [bikeOptions, setBikeOptions] = useState(mipOTPParseBicycleOptions(query))
    const [map, setMap] = useState(null)
    const [focusedItinerary, setFocusedItinerary] = useState(null)
    const [selectedItinerary, setSelectedItinerary] = useState(null)
    const swapLocations = () => {
        const temp = startLocation
        setStartLocation(endLocation)
        setEndLocation(temp)
    }
    const recalcPathPlan = async (lang) => {
        if (!startLocation) {
            toast.error(t("MissingStart"), { toastId: "no-start-error" })
        } else if (!endLocation) {
            toast.error(t("MissingEnd"), { toastId: "no-end-error" })
        } else {
            setPlanning(true)
            setPlan(null)
            setSelectedItinerary(null)
            setFocusedItinerary(null)
            try {
                if (url) {
                    Router.push({
                        pathname: url,
                        query: mipPathSearchQuery(lang, planMode,
                            startLocation.label, startLocation.coordinates,
                            endLocation.label, endLocation.coordinates,
                            planDateOption, planDate, bikeOptions)
                    })
                } else {
                    const newPlan = await mipPathSearch(lang, planMode,
                        startLocation.label, startLocation.coordinates,
                        endLocation.label, endLocation.coordinates,
                        planDateOption, planDate, bikeOptions)
                    console.log(newPlan)
                    setPlan(newPlan)
                }
            } catch (exc) {
                console.log(exc)
            }
            setPlanning(false)
        }
    }
    const zoomToPoint = (latLon) => {
        map?.setView(latLon, 16)
    }
    useEffect(() => {
        if (plan?.plan?.mbr && map) {
            map?.fitBounds(plan.plan.mbr)
            if (plan?.plan?.itineraries?.length) {
                setFocusedItinerary(plan.plan.itineraries[0])
        }
}
    }, [plan])
    useEffect(() => {
        if (selectedItinerary) {
            map?.fitBounds(selectedItinerary.mbr)
        }
    }, [selectedItinerary])
    const context = {
        plan, planning,
        startLocation, setStartLocation,
        endLocation, setEndLocation,
        planMode, setPlanMode,
        planDateOption, setPlanDateOption,
        planDate, updatePlanDate, updatePlanTime,
        bikeOptions, setBikeOptions,
        selectedItinerary, setSelectedItinerary,
        focusedItinerary, setFocusedItinerary,
        swapLocations, recalcPathPlan,
        zoomToPoint, setMap
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

/**
 * Form per la richiesta dei dati per la pianificazione
 * @param {String} className nome della classe da aggiungere nell'elemento esterno 
 * @param {String} title titolo del dialogo 
 * @param {Boolean} responsive se true il dialogo cambia forma sui tablet
 * @returns elemento react
 */
function MIPPathDataForm({ className, title, responsive }) {
    const { planning, recalcPathPlan } = useContext(MIPPlannerContext)
    const { t, lang } = useTranslation("planner")
    function onPathSearch(event) {
        event.preventDefault()
        event.stopPropagation()
        recalcPathPlan && recalcPathPlan(lang)
    }
    return (
        <form className={mipConcatenate(className, styles.path_data_dialog, responsive ? styles.responsive : undefined)}
            onSubmit={onPathSearch}>
            <MIPForms.IconTitle className={styles.title} icon="/icons/path-search.svg" title={title} />
            <MIPPathLocations className={styles.path_data_panel} />
            <MIPPathModeOptions className={styles.mode_options} />
            <MIPTransitOptions className={styles.additional_options} />
            <MIPBicycleOptions className={styles.additional_options} />
            {planning ?
                <MIPForms.Loading className={styles.loading_indicator} />
                :
                <input className={styles.submit_button} type="submit" value={t("Submit")} />
            }
        </form >
    )
}

/**
 * Elemento per la richiesta del punto di partenza e arrivo
 * 
 * @param {String} className nome della classe da aggiungere nell'elemento esterno 
 * @returns elemento React
 */
function MIPPathLocations({ className }) {
    const { t } = useTranslation("planner")
    const {
        startLocation, setStartLocation,
        endLocation, setEndLocation,
        swapLocations
    } = useContext(MIPPlannerContext)
    return (
        <div className={className}>
            <MIPAddressAutocompleteInput id="start-position"
                label={t("StartLabel")}
                icon="/icons/path-start.svg"
                searchString={startLocation?.label}
                placeholder={t("StartPlaceholder")} loadingMsg={t("Loading")}
                onChange={setStartLocation} value={startLocation} />
            <div className={styles.input_separator} />
            <MIPForms.IconButton className={styles.swapLocations} icon="/icons/path-swap.svg" onClick={swapLocations} label="scambia" />
            <MIPAddressAutocompleteInput id="start-position"
                label={t("EndLabel")}
                icon="/icons/path-dest.svg"
                searchString={endLocation?.label}
                placeholder={t("EndPlaceholder")} loadingMsg={t("Loading")}
                onChange={setEndLocation} value={endLocation} />
        </div>
    )
}

/**
 * Elemento per la richiesta della modalità di trasporto
 * 
 * @param {String} className nome della classe da aggiungere nell'elemento esterno 
 * @returns elemento React
 */
function MIPPathModeOptions({ className }) {
    const { t } = useTranslation("planner")
    const { planMode, setPlanMode } = useContext(MIPPlannerContext)
    return (
        <RadioGroup className={styles.className} value={planMode}
            onChange={setPlanMode} >
            <RadioGroup.Label className={styles.mode_label}>{t("PlanType")}</RadioGroup.Label>
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

/**
 * Richiesta di parametri addizionali per la modalità transit
 * 
 * @param {String} className nome della classe da aggiungere nell'elemento esterno 
 * @returns elemento React
 */
function MIPTransitOptions({ className }) {
    const { t } = useTranslation("planner")
    const {
        planMode,
        planDateOption, setPlanDateOption,
        planDate, updatePlanDate, updatePlanTime,
    } = useContext(MIPPlannerContext)
    return (planMode === MIPPlanMode.TRANSIT ? <>
        <div className={className}>
            <select id="plan-date" className={styles.option_select}
                value={planDateOption} onChange={e => setPlanDateOption(e.target.value)}>
                {Object.values(MIPDateOption).map(k =>
                    <option key={k} value={k}>{t("DateOption." + k)}</option>
                )}
            </select>
            {planDateOption !== MIPDateOption.START_NOW &&
                <div className={styles.additional_option_group}>
                    <input id="start-time-picker" type="time"
                        onChange={e => updatePlanTime(e.target.value)}
                        value={toISOLocalTime(planDate)}
                    />
                    <input id="start-date-picker" type="date"
                        onChange={e => updatePlanDate(e.target.valueAsNumber)}
                        value={toISOLocalDate(planDate)}
                    />
                </div>}
        </div>
    </> : null)
}

/**
 * Richiesta di parametri addizionali per la modalità bike
 * 
 * @param {String} className nome della classe da aggiungere nell'elemento esterno 
 * @returns elemento React
 */
function MIPBicycleOptions({ className }) {
    const { t } = useTranslation("planner")
    const {
        planMode,
        bikeOptions, setBikeOptions,
    } = useContext(MIPPlannerContext)
    return planMode == MIPPlanMode.BICYCLE ?
        <div className={className}>
            <label htmlFor="bike-option-selector">{t("BikePathTypeTitle")}</label>
            <select id="bike-option-selector"
                value={bikeOptions}
                onChange={e => setBikeOptions(e.target.value)}>
                {Object.keys(MIPBikeOptions).map(opt =>
                    <option key={opt} value={opt}>{t(`BikePathType.${opt}`)}</option>
                )}
            </select>
        </div>
        : null
}

const MIPPath = {
    Context: MIPPlannerContext,
    Controller: MIPPathController,
    DataForm: MIPPathDataForm
}

export default MIPPath