/**
    Duel S.p.A.

    Componenti per visualizzazione dei passi/colli alpini

    Revision history

    | Data       | Autore | Descrizione 
    | ---------- | ------ | ----------------------------------- |
    | 2021/08/10 | Duel   | Prima versione                      |
*/

import styles from './MIPPass.module.scss'

import useTranslation from 'next-translate/useTranslation'

import { mipConcatenate } from '../../lib/MIPUtility'
import MIPLegend from '../forms/MIPLegend';

function getStyle(style, pass) {
    return `${style} ${pass.state ? styles.open : styles.closed}`;
}

function MIPPassDataCard({ className, passData }) {
    const { t, tl } = useTranslation('common')
    const finalClassName = mipConcatenate(className, styles.data_card)
    return (
        <div className={finalClassName}>
            <h4 className={styles.name}>{passData.name}</h4>
            <p className={getStyle(styles.state, passData)}>{passData.state ? t("Open") : t("Closed")}</p>
        </div>
    )
}

function MIPPassDataList({ className, passData }) {
    const finalClassName = mipConcatenate(className, styles.external_panel)

    return (
        <div className={finalClassName}>
            {passData && passData.map(pass =>
                <div className={getStyle(styles.list_frame, pass)} key={pass.name}>
                    <MIPPassDataCard className={styles.event} passData={pass} />
                </div>
            )}
        </div>
    )
}

/**
 * 
 * @param {string} className nome della classe del pannello esterno
 * @param {string} headerClassName nome della classe dell'header
 * @param {string} contentClassName nome della classe del contenuto
 * @param {string} title titolo del pannello
 * @param {string} subtitle sottotitolo del pannello (facoltativo)
 *  
 * @returns 
 */
function MIPPassDataPanel({
    className, headerClassName, contentClassName,
    passData, enableSearch }) {
    const { t, tl } = useTranslation('common')
    const finalClassName = mipConcatenate(className, styles.external_panel)
    const finalHeaderClassName = mipConcatenate(headerClassName, styles.panel_header)
    const finalContentClassName = mipConcatenate(contentClassName, styles.list_container)
    return (
        <div className={finalClassName}>
            <div className={finalHeaderClassName}>
                <h3 className={styles.title}>{t("PassesTitleShort")}</h3>
                <h4 className={styles.subtitle}>{t("DiscoverPasses")}</h4>
                {enableSearch &&
                    <div className={styles.search_panel}>
                        <input placeholder={t("PassSearch")} list="passes" />
                        <datalist id="passes">
                            {passData.map(pass =>
                                <option key={pass.name}>{pass.name}</option>
                            )}
                        </datalist>
                    </div>
                }
            </div>
            <div className={finalContentClassName}>
                <MIPPassDataList passData={passData} />
            </div>
        </div>
    )
}

const items = [
    {
        title: 'ClosedPass',
        icon: 'pass-closed'
    },
    // {
    //     title: 'Colle con chisura programmata',
    //     icon: 'pass-future-close'
    // },
    {
        title: 'OpenPass',
        icon: 'pass-open'
    },
]

function MIPPassLegend({ className }) {
    const { t, tl } = useTranslation('common')
    return (
        <MIPLegend className={className} title={t("Legend")}
            items={items.map(i => ({
                title: t(i.title),
                icon: i.icon,
            }))} />
    )
}

export default {
    Panel: MIPPassDataPanel,
    List: MIPPassDataList,
    Card: MIPPassDataCard,
    Legend: MIPPassLegend

}