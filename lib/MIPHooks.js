/**
    (C) Duel srl 2021.

    React hook per la semplificazione dei task svolti dal
    portale

    Revision history

    | Data       | Autore | Descrizione 
    | ---------- | ------ | ----------------------------------- |
    | 2021/11/03 | Duel   | Prima versione                      |
*/

import { useState } from "react"

/**
 * Hook per valori booleani 
 * @param {*} basePath 
 * @param {*} createFn 
 * @returns 
 */
export function useToggle(initialState) {
    [state, setState] = useState(initialState ? true : false)

    function toggle() {
        setState(!state)
    }

    return [state, toggle]
}

/**
 * Hook per il caching delle icone leaflet già create
 * 
 * @param {String} basePath path di base per le icone
 * @param {String} createFn una funzione per la creazione di un'icona non in cache
 * 
 * @returns functione getIcon(name) che ritorna un'icona dato il nome
 */
export function useIconMap(basePath, createFn) {
    const iconMap = new Map()
    const fallbackIcon = createFn(`${basePath}_fallback.svg`)
    function getIcon(name, selected) {
        const iconPath = `${basePath}_${name}${selected ? '_sel' : ''}.svg`
        let icon = iconMap.get(iconPath)
        if (!icon) {
            icon = createFn(iconPath)
            if (icon) {
                iconMap.set(iconPath, icon)
            } else {
                icon = fallbackIcon
            }
        }
        return icon
    }

    return getIcon
}