/**
    (C) Duel srl 2021.

    React hook per la semplificazione dei task svolti dal
    portale

    Revision history

    | Data       | Autore | Descrizione 
    | ---------- | ------ | ----------------------------------- |
    | 2021/11/03 | Duel   | Prima versione                      |
*/

import { useMemo } from "react"

export function useIconMap(basePath, createFn) {
    const iconMap = new Map()
    const fallbackIcon = createFn(`${basePath}_fallback.png`)
    function getIcon(name) {
        const iconPath = `${basePath}_${name}.png`
        let icon = iconMap.get(name)
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