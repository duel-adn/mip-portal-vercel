import Link from 'next/link'
import styles from './MIPPageFooter.module.scss';

export default function MIPPageFooter(props) {
    return (
        <div className={`${props.className} ${styles.page_footer}`}>
            <nav className={styles.navbar}>
                <ul>
                    <li>
                        <Link href="#"><a>Mappa del sito</a></Link><span>|</span>
                    </li>
                    <li>
                        <Link href="#"><a>Disclaimer</a></Link><span>|</span>
                    </li>
                    <li>
                        <Link href="#"><a>Cookies</a></Link><span>|</span>
                    </li>
                    <li>
                        <Link href="#"><a>Radio</a></Link><span>|</span>
                    </li>
                    <li>
                        <Link href="#"><a>Contatti</a></Link>
                    </li>
                </ul>
            </nav>
            <div className={styles.credits}>
                <div className={styles.credit}>
                    <p>Un servizio di</p>
                    <img src="/images/regione-footer.png" alt="regione piemonte" />
                </div>
                <div className={styles.credit}>
                    <p>In collaborazione con</p>
                    <img src="/images/5t-footer.png" alt="5T srl" />
                </div>
            </div>
        </div>
    )
}
