/**
    (C) Duel srl 2021.

    Contenuto pagina 404.

    Revision history

    | Data       | Autore | Descrizione 
    | ---------- | ------ | ----------------------------------- |
    | 2021/08/10 | Duel   | Prima versione                      |
*/

import Link from 'next/link';
import styles from './MIPPage.module.scss'

export default function MIP404Panel(props) {

    const className = `${props.className || ''} ${styles.page_404}`;

    return (
        <div className={className}>
            <img src='/images/not-found.svg' alt="donna con binocolo"/>
            <div className={styles.container}>
                <h2>Ci dispiace, non abbiamo trovato quello che cercavi.</h2>
                <p>Puoi provare queste pagine:</p>
                <ul>
                <li><Link href="/traffic"><a className={styles.link}>Vai alle news del Traffico in Tempo Reale</a></Link></li>
                <li><Link href="/tpl" ><a className={styles.link}>Vai alle news del Trasporto Pubblico Locale</a></Link></li>
                <li><Link href="/colli"><a className={styles.link}>Vai ai Colli Alpini del Piemonte</a></Link></li>
                <p>oppure</p>
                <li><Link href="/"><a className={styles.home_link}>Vai alla home page</a></Link></li>
                </ul>
            </div>
        </div>

    )
    
}