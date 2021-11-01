/**
    Duel srl

    Componenti per la visualizzazione degli eventi di traffico

    Revision history

    | Data       | Autore | Descrizione 
    | ---------- | ------ | ----------------------------------- |
    | 2021/08/10 | Duel   | Prima versione                      |
*/

import { useMemo, useRef, useState } from "react"
import styles from "./MIPTraffic.module.scss"
import { mipConcatenate, debounce } from "../../lib/MIPUtility"
import { mipGetTrafficEventIconUrl } from "./MIPTrafficAPI"

/**
 * Card che mostra un singolo evento di traffico
 * @param {string} className classe aggiuntiva per l'elemento esterno
 * @param {Boolean} compact se true la card è in forma compatta 
 * @param {Object} un oggetto con i dati dell'evento
 * @returns 
 */
export function MIPTrafficEventCard({className, compact, event}) {
    const finalClassName = mipConcatenate(className, styles.traffic_event_card)
    const isCompact = compact === undefined ? false : compact
    return ((typeof event === undefined) || (event === null) ? null :
        <div className={finalClassName}>
            <h5 className={styles.title}
                style={{ 'backgroundImage': `url(${mipGetTrafficEventIconUrl(event.style)})` }}>{event.road}</h5>
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
    console.log(text)
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
 * Costruisce un componente fatto da un ox di ricerca opzionale seguito da un pannello
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
function MIPTrafficEventCardList({className, searchable, searchPlaceholder, compact, trafficEventData}) {
    const finalClassName = mipConcatenate(className, styles.traffic_event_card_list)
    const placeholder = searchPlaceholder || "Cerca tra gli eventi di traffico"
    const inputElementRef = useRef(null)
    const [filterText, setFilterText] = useState('')
    const filteredEvents = useMemo(() => filterEvents(trafficEventData, filterText), [trafficEventData, filterText])
    const onInputChange = debounce((event) => setFilterText(event.target.value.toLowerCase()))
    const onInputKey = (event) => event.key === 'Escape' && clearInput()
    const clearInput = () => {inputElementRef.current.value='' ; setFilterText(''); inputElementRef.current.focus()}
    return (
        <div className={finalClassName}>
            { searchable && 
                <div className={styles.search_panel}>
                    <input type="text" tabIndex="0" className={styles.input}
                        ref={inputElementRef} 
                        onChange={onInputChange}
                        placeholder={placeholder} 
                        onKeyUp={onInputKey}/>
                    <input type="button" className={styles.clearButton} value="&#10006;" onClick={clearInput}/>
                </div>
            }
            <div className={styles.list_container}> 
                <ul >
                { filteredEvents && filteredEvents.map && filteredEvents.map(event => 
                    <li key={event.id} className={styles.list_item}>
                        <MIPTrafficEventCard compact={compact} event={event}/>
                    </li>
                )}
                </ul>
            </div>
        </div>
    )
}

function MIPTrafficPanel({className, headerClass, listClass, searchable, searchPlaceholder, title, subtitle, compact, trafficEventData}) {
    const finalClassName = mipConcatenate(className, styles.traffic_panel)
    const finalHeaderClass = mipConcatenate(headerClass, styles.header)
    const finalListClass = mipConcatenate(listClass, styles.event_list)
    return (
        <div className={finalClassName}>
            <div className={finalHeaderClass}>
                <h3 className={styles.title}>{title}</h3>
                { subtitle && 
                    <h4 className={styles.subtitle}>{subtitle}</h4>
                }
            </div>
            <MIPTrafficEventCardList className={finalListClass} compact={compact}
                searchable={searchable} searchPlaceholder={searchPlaceholder}
                trafficEventData={trafficEventData}
            />
        </div>
    )
}
/**
 * Elemento esportato
 */
const MIPTraffic = {
    EventCard: MIPTrafficEventCard,
    EventCardList: MIPTrafficEventCardList,
    Panel: MIPTrafficPanel,
}

export default MIPTraffic