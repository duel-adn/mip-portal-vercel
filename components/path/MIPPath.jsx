/**
    Duel S.p.A.

    Elementi interfaccia pianificazione viaggio

    Revision history

    | Data       | Autore | Descrizione 
    | ---------- | ------ | ----------------------------------- |
    | 2021/08/10 | Duel   | Prima versione                      |
*/
import styles from './MIPPath.module.scss'

import { useState } from 'react';
import { RadioGroup } from '@headlessui/react'

import useTranslation from 'next-translate/useTranslation'
import MIPAddressAutocompleteInput from './MIPAddressAutocompleteInput'

import { mipConcatenate } from '../../lib/MIPUtility';
import { MIPPlanMode, mipPathSearch } from './MIPPathAPI';
import { translatePathMode } from '../../lib/MIPPlanTranslator';

const PATH_ORIGIN_ID = 'path_origin'
const PATH_DEST_ID = 'path_dest'

function MIPPathController({ className, title, responsive, onPathPlan }) {
    const { t, lang } = useTranslation("planner")
    const [startLocation, setStartLocation] = useState(null)
    const [endLocation, setEndLocation] = useState(null)
    const [selectedOption, setSelectedOption] = useState(MIPPlanMode.publicTransport)
    const [plan, setPlan] = useState(null)

    const onChangeLocation = (id, location) => {
        switch (id) {
            case PATH_ORIGIN_ID:
                setStartLocation(location)
                setPlan(null)
                break

            case PATH_DEST_ID:
                setEndLocation(location)
                setPlan(null)
                break

            default:
                console.log(`Invalid id for path endpoint: ${id}`)
        }
    }
    async function onPathSearch(event) {
        event.preventDefault()
        event.stopPropagation()
        if (!startLocation) {
            // TODO: improve 
            alert(t("MissingStart"))
        } else if (!endLocation) {
            alert(t("MissingEnd"))
        } else {
            if (onPathPlan) {
                onPathPlan(startLocation.label, startLocation.coordinates, endLocation.label, endLocation.coordinates, selectedOption)
            }
            // const response = await mipPathSearch(locale, startLocation.label, startLocation.coordinates, endLocation.label, endLocation.coordinates, selectedOption.value)
            // setPlan(response)
        }
        return false
    }
    return (
        <>
            <MIPPathDataDialog className={className}
                title={title}
                responsive={responsive}
                onChangeLocation={onChangeLocation}
                selectedOption={selectedOption}
                onChangeOption={setSelectedOption}
                onSubmit={onPathSearch}
            />
        </>
    )
}

function MIPPathDataDialog({ className, title, responsive, compact, onChangeLocation, selectedOption, onChangeOption, onSubmit }) {
    const { t } = useTranslation("planner")
    return (
        <form className={mipConcatenate(className, styles.path_data_dialog, responsive ? styles.responsive : undefined)} onSubmit={onSubmit}>
            {title &&
                <h3 className={styles.title}>{title}</h3>
            }
            <div className={styles.endpoint_data_container}>
                <MIPAddressAutocompleteInput id={PATH_ORIGIN_ID} className={styles.input}
                    icon='/icons/path-start.svg' placeholder={t("StartPlaceholder")}
                    onChange={onChangeLocation} />
                <MIPAddressAutocompleteInput id={PATH_DEST_ID} className={styles.input}
                    icon='/icons/path-dest.svg' placeholder={t("EndPlaceholder")}
                    onChange={onChangeLocation} />
                <div className={styles.input_separator} />
                <button className={styles.swap_button} />
            </div>
            <MIPPathOptions selectedOption={selectedOption} setSelectedOption={onChangeOption} />
            <input className={styles.submit_button} type="submit" value={t("Submit")} />
        </form>
    )
}

// Sincronizzare con MIPPathApi.PathPlanMode
const pathPlanModeOptions = [
    MIPPlanMode.vehicle,
    MIPPlanMode.publicTransport,
    MIPPlanMode.bicycle,
    MIPPlanMode.pedestrian].map(mode =>
    ({
        mode: mode,
        ...translatePathMode(null, mode)
    })
    )

function MIPPathOptions({ selectedOption, setSelectedOption }) {
    return (
        <RadioGroup className={styles.path_options} value={selectedOption}
            onChange={setSelectedOption} >
            <RadioGroup.Label className={styles.label}>Mostra percorso</RadioGroup.Label>
            <div className={styles.radio_group}>
                {pathPlanModeOptions.map(opt =>
                    <RadioGroup.Option key={opt.mode}
                        value={opt.mode}
                        className={({ active, checked }) => mipConcatenate(styles.option,
                            active ? styles.active : '',
                            checked ? styles.checked : '')
                        }>
                        <img className={styles.icon}
                            src={`/path-icons/mode-${opt.iconName}.svg`} alt={opt.iconAlt} />
                        <RadioGroup.Label className={styles.radio_label}>{opt.shortDescription}</RadioGroup.Label>
                    </RadioGroup.Option>
                )}
            </div>
        </RadioGroup>
    )
}

const MIPPath = {
    Controller: MIPPathController,
    DataDialog: MIPPathDataDialog
}

export default MIPPath