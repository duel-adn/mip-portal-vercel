import styles from './MIPPass.module.scss'
import {mipConcatenate} from '../../lib/MIPUtility'
import MIPPassDataList from './MIPPassDataList'

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
export default function MIPPassDataPanel({
    className, headerClassName, contentClassName,
    title, subtitle,
    searchPlaceholder,
    passData}) {
    const finalClassName = mipConcatenate(className, styles.external_panel)
    const finalHeaderClassName = mipConcatenate(headerClassName, styles.panel_header)
    const finalContentClassName = mipConcatenate(contentClassName, styles.list_container)
    return (
        <div className={finalClassName}>
            <div className={finalHeaderClassName}>
                <h3 className={styles.title}>{title}</h3>
                <h4 className={styles.subtitle}>{subtitle}</h4>
                <div className={styles.search_panel}>
                    <input placeholder={searchPlaceholder} list="passes" />
                    <datalist id="passes">
                        { passData.map(pass => 
                            <option key={pass.name}>{pass.name}</option>
                        )}
                    </datalist>
                </div>
            </div>
            <div className={finalContentClassName}>
                <MIPPassDataList passData={passData} />
            </div>
        </div>
    )
}