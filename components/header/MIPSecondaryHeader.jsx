/**
    (C) Duel srl 2021.

    Header secondario delle pagine (non compare su mobile)

    Revision history

    | Data       | Autore | Descrizione 
    | ---------- | ------ | ----------------------------------- |
    | 2021/08/10 | Duel   | Prima versione                      |
*/

import styles from './MIPPageHeader.module.scss'

import { useRouter } from 'next/router'

const Languages = [
    {
        lang: 'it',
        description: 'IT'
    },
    {
        lang: 'en',
        description: 'EN'
    }
]
/**
 * Header secondario
 * 
 * @param {*} props le property dell'elemento
 * @param props.className classe da aggiungere all'elemento esterno
 * 
 * @returns il template dell'elemento
 */
export default function MIPSecondaryHeader(props) {
    const router = useRouter()
    console.log(router)
    const className = `${props.className} ${styles.secondary_header}`
    function setLocale(locale) {
        console.log('Setting locale to ' + locale)
        document.cookie = `NEXT_LOCALE=${locale}; path=/`
        router.push(router.pathname, router.saPath, { locale })
    }

    return (
        <nav className={className}>
            <div className={styles.tools}>
                <a className={styles.link} href="https://twitter.com/MIPiemonte" target="_blank" rel="noreferrer noopener">
                    <span>Seguici su</span>
                    <img className={styles.icon} src="/icons/twitter.svg" alt="twitter" />
                </a>
                <select onChange={event => setLocale(event.target.value)}>
                    {Languages.map(lang =>
                        <option value={lang.lang} selected={lang.lang === router.locale}>{lang.description}</option>
                    )}
                </select>
                {/* <button className="mip-md-none">Area riservata</button> */}
            </div>
        </nav>
    )
}