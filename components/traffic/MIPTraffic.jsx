/**
    Duel srl

    Componenti per la visualizzazione degli eventi di traffico

    Revision history

    | Data       | Autore | Descrizione 
    | ---------- | ------ | ----------------------------------- |
    | 2021/08/10 | Duel   | Prima versione                      |
*/

import styles from "./MIPTraffic.module.scss"
import { useMemo, useRef, useState , createContext, useContext, useEffect} from "react"

import useTranslation from 'next-translate/useTranslation'

import { mipConcatenate, mipDebounce } from "../../lib/MIPUtility"
import MIPForms from '../forms/MIPForms';

const initialContext = {
    eventData: null,
    map: null
}

const MIPTrafficContext = createContext(initialContext)

function MIPTrafficControlller({eventData, children}) {
    const [trafficEventData, setTrafficEventData] = useState(eventData)
    const [map, setMap] = useState(null)
    const [selectedEvent, setSelectedEvent] = useState(null)
    useEffect(() => {
        if (selectedEvent?.id && map) {
            map.panTo([selectedEvent.lat, selectedEvent.lng])
        }
    }, [selectedEvent])
    const context = {
        trafficEventData,
        map, setMap,
        setSelectedEvent, selectedEvent
    }
    return (
        <MIPTrafficContext.Provider value={context}>
            {children}
        </MIPTrafficContext.Provider>
    )
}

function MIPTrafficPanel({ className, headerClass, listClass, searchable, searchPlaceholder, title, subtitle, compact }) {
    const finalClassName = mipConcatenate(className, styles.traffic_panel)
    const finalHeaderClass = mipConcatenate(headerClass, styles.header)
    const finalListClass = mipConcatenate(listClass, styles.event_list)
    const { trafficEventData } = useContext(MIPTrafficContext)

    return (
        <div className={finalClassName}>
            <MIPForms.IconTitle className={finalHeaderClass} icon="/icons/traffic.svg"
                title={title} subtitle={subtitle} url="/traffic/" />
            <MIPTrafficEventCardList className={finalListClass} compact={compact}
                searchable={searchable} searchPlaceholder={searchPlaceholder}
                trafficEventData={trafficEventData}
            />
        </div>
    )
}

/**
 * Card che mostra un singolo evento di traffico
 * @param {string} className classe aggiuntiva per l'elemento esterno
 * @param {Boolean} compact se true la card è in forma compatta 
 * @param {Object} un oggetto con i dati dell'evento
 * @returns 
 */
function MIPTrafficEventCard({ id, className, compact, event }) {
    const finalClassName = mipConcatenate(className, styles.traffic_event_card)
    const isCompact = compact === undefined ? false : compact
    return ((typeof event === undefined) || (event === null) ? null :
        <div id={id} className={finalClassName} style={{ 'backgroundImage': `url(/traffic-icons/ico-${event.style}.svg)` }}>
            <h5 className={styles.card_title}>{event.road}</h5>
            <div className={styles.container}>
                {isCompact ?
                    <>
                        <p className={styles.text}>{event.what}</p>
                        <p className={styles.text}>{event.where}</p>
                    </>
                    :
                    <>
                        <p className={styles.where}>{event.where}</p>
                        <p className={styles.what}>{event.what}</p>
                        {
                            event.when &&
                            <div className={styles.when}>{event.when}</div>
                        }
                    </>
                }
            </div>
        </div>
    )
}

/**
 * Verifica che un evento contenga la stringa da ricercare
 * @param {String} text stringa da ricercare
 * @param {Object} event evento 
 * @returns true se l'evento contiene la stringa
 * 
 * TODO: verificare possibilità di usare libreria esterna x ricerche più sofisticate
 */
function filterEvents(eventData, text) {
    if ((text !== null) && (text.length > 0)) {
        const filtered = eventData.filter(event =>
            event.road && event.road.toLowerCase().includes(text) ||
            event.what && event.what.toLowerCase().includes(text) ||
            event.where && event.where.toLowerCase().includes(text))
        return filtered
    }
    return eventData
}

/**
 * Costruisce un componente fatto da un box di ricerca opzionale seguito da un pannello
 * scrollabile con una lista di card.
 * 
 * @param {string} className classe aggiuntiva per l'elemento esterno
 * @param {Boolean} searchable se true viene visualizzato un box che permette la selezione delle card 
 * @param {String} searchPlaceholder testo da usare come placeholder per il box di ricerca
 * @param {Boolean} compact se true le card della lista sono in forma compatta 
 * @param {Object} trafficEventData un array di oggetti con i dati degli eventi
 *  
 * @returns un componente che contiene una lista di MIPTrafficEventCard
 * 
 * TODO: Verificare accessibilità box di input per selezione
 */
function MIPTrafficEventCardList({ className, searchable, searchPlaceholder, compact, trafficEventData }) {
    const { t } = useTranslation('traffic')
    const finalClassName = mipConcatenate(className, styles.traffic_event_card_list)
    const placeholder = searchPlaceholder || t("EventSearch")
    const inputElementRef = useRef(null)
    const [filterText, setFilterText] = useState('')
    const filteredEvents = useMemo(() => filterEvents(trafficEventData, filterText), [trafficEventData, filterText])
    const onInputChange = mipDebounce((event) => setFilterText(event.target.value.toLowerCase()))
    const onInputKey = (event) => event.key === 'Escape' && clearInput()
    const clearInput = () => { inputElementRef.current.value = ''; setFilterText(''); inputElementRef.current.focus() }
    const { selectedEvent, setSelectedEvent } = useContext(MIPTrafficContext)
    return (
        <div className={finalClassName}>
            {searchable &&
                <div className={styles.search_panel}>
                    <input type="text" tabIndex="0" className={styles.input}
                        ref={inputElementRef}
                        onChange={onInputChange}
                        placeholder={placeholder}
                        onKeyUp={onInputKey} />
                    <input type="button" className={styles.clearButton} value="&#10006;" onClick={clearInput} />
                </div>
            }
            <div className={styles.list_container}>
                <ul >
                    {filteredEvents && filteredEvents.map && filteredEvents.map(event =>
                        <li key={event.id} className={mipConcatenate(styles.list_item, event.id === selectedEvent?.id ? styles.event_selected : null)}
                            onClick={() => setSelectedEvent(event)}>
                            <MIPTrafficEventCard id={`te-card-${event.id}`} compact={compact} event={event} />
                        </li>
                    )}
                </ul>
            </div>
        </div>
    )
}

const LegendItems = [
    {
        title: 'Free',
        icon: 'no-traffic'
    },
    {
        title: 'Heavy',
        icon: 'light-traffic'
    },
    {
        title: 'Delayed',
        icon: 'heavy-traffic'
    },
    {
        title: 'Queued',
        icon: 'queued-traffic'
    },
]

function MIPTrafficLegend({ className }) {
    const { t, tl } = useTranslation('traffic')

    return (
        <MIPForms.Legend className={className} title={t("Legend")}
            items={LegendItems.map(i => ({ title: t(i.title), icon: i.icon }))} />
    )
}


/**
 * Elemento esportato
 */
const MIPTraffic = {
    Context: MIPTrafficContext,
    Controller: MIPTrafficControlller,
    EventCard: MIPTrafficEventCard,
    EventCardList: MIPTrafficEventCardList,
    Legend: MIPTrafficLegend,
    Panel: MIPTrafficPanel,
}

export default MIPTraffic