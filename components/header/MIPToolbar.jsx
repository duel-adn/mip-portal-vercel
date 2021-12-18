import styles from './MIPHeader.module.scss'

export default function MipToolbar(props) {
    return (
        <nav className={`${props.className} ${styles.toolbar}`}>
            <div/>
            <div className={styles.tools}>
                <a href="https://twitter.com/MIPiemonte" target="_blank" rel="noreferrer noopener">
                    <span>Seguici su</span>
                    <img src="/icons/twitter.svg" alt="twitter" />
                </a>
                <select>
                    <option value="IT">IT</option>
                    <option value="EN">EN</option>
                </select>
                {/* <button>Area riservata</button> */}
            </div>
        </nav>
    )
}