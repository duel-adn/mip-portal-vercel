import { useState } from 'react';
import { RadioGroup } from '@headlessui/react'
import styles from './MIPPath.module.scss'
import MIPAddressAutocompleteInput from './MIPAddressAutocompleteInput'
import { mipConcatenate } from '../../lib/MIPUtility';
import { mipPathSearch } from './MIPPathAPI';

const PATH_ORIGIN_ID = 'path_origin'
const PATH_DEST_ID = 'path_dest'

function MIPPathController({className, title, responsive}) {
    const [startLocation, setStartLocation] = useState(null)
    const [endLocation, setEndLocation] = useState(null)
    const [selectedOption, setSelectedOption] = useState(optionData[0])
    const [plans, setPlans] = useState(null)

    const onChangeLocation = (id, location) => {
        switch (id) {
            case PATH_ORIGIN_ID:
                setStartLocation(location)
                setPlans(null)
                break

            case PATH_DEST_ID:
                setEndLocation(location)
                setPlans(null)
                break

            default:
                console.log(`Invalid id for path endpoint: ${id}`)
        }
    }
    const pathSearch = async (event) => {
        if (onSubmit) {
            onSubmit(startLocation, endLocation)
        }
    }
    async function onPathSearch(event) {
        event.preventDefault()
        event.stopPropagation()
        if (!startLocation) {
            alert("No start location")
        } else if (!endLocation) {
            alert("No end location")
        } else {
            const response = await mipPathSearch('IT', startLocation.label, startLocation.coordinates, endLocation.label, endLocation.coordinates, 'CAR')
            setPlans(response)
        }
        return false
    }
    return (
        <div>
            <MIPPathDataDialog className={className} 
                title={title}
                responsive={responsive}
                onChangeLocation={onChangeLocation} 
                onSubmit={onPathSearch}
            />
            {plans && 
                <MIPPathResults plans={plans}/>
            }
        </div>
    )
}

function MIPPathDataDialog({className, title, responsive, onChangeLocation, onSubmit}) {
    const [selectedOption, setSelectedOption] = useState(optionData[0])
    return (
    <form className={mipConcatenate(className, styles.path_data_dialog, responsive ? styles.responsive : undefined)} onSubmit={onSubmit}>
        { title && 
            <h3 className={styles.title}>Calcola il percorso</h3>
        }
        <div className={styles.endpoint_data_container}>
            <MIPAddressAutocompleteInput id={PATH_ORIGIN_ID} className={styles.input}
                icon='/icons/path-start.svg' placeholder='Punto di partenza' 
                onChange={onChangeLocation} />
            <MIPAddressAutocompleteInput id={PATH_DEST_ID} className={styles.input}
                icon='/icons/path-dest.svg' placeholder='Punto di arrivo'
                onChange={onChangeLocation} />
            <div className={styles.input_separator}/>
            <button className={styles.swap_button} />
        </div>
        <MIPPathOptions selectedOption={selectedOption} setSelectedOption={setSelectedOption}/>
        <input className={styles.submit_button} type="submit" value="Calcola" />
    </form>
    )
}

const optionData = [
    {
        id: 'vehicle',
        title: 'auto',
        icon: styles.car,
        value: "CAR",
        initialState: true
    },
    {
        id: 'public_transport',
        title: 'mezzi pubblici',
        value: "PUBLIC",
        icon: styles.bus,
        initialState: false
    },
    {
        id: 'bike',
        title: 'bicicletta',
        value: "BIKE",
        icon: styles.bike,
        initialState: false
    },
    {
        id: 'pedestrian',
        title: 'a piedi',
        icon: styles.walk,
        value: "WALK",
        initialState: false
    },
]
function MIPPathOptions({selectedOption, setSelectedOption}) {
    return (
        <RadioGroup className={styles.path_options} value={selectedOption} onChange={setSelectedOption} >
        <RadioGroup.Label className={styles.label}>Mostra percorso</RadioGroup.Label>
        <div className={styles.radio_group}>
            {optionData.map(opt => 
                <RadioGroup.Option key={opt.id}
                    value={opt} 
                    className={({ active, checked }) => mipConcatenate(styles.option, opt.icon,
                        active ? styles.active : '',
                        checked ?  styles.checked : '')}>
                    <RadioGroup.Label className={styles.radio_label}>{opt.title}</RadioGroup.Label>
                </RadioGroup.Option>
            )}
        </div>
    </RadioGroup>            
    )
}

function MIPPathResultCard({step}) {

}

function MIPPathResults({plans}) {
    return (
        <div className={styles.path_plans_container}>
        { plans.itineraries.map((itinerary, idx) => 
            <div key={idx} className={styles.itinerary_container}>
                <div>Iinerary</div>
                { itinerary.legs.map((leg, idx) =>
                    <div key={idx}>
                        {leg.steps.map((step, idx) => 
                            <div key={idx} className={styles.instruction}>
                                <img src={`/path-icons/${step.icon}.svg`}/>
                                <div>{step.instructions}</div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        )}
        </div>
    )
}

const MIPPath = {
    Controller: MIPPathController,
    DataDialog: MIPPathDataDialog
}

export default MIPPath