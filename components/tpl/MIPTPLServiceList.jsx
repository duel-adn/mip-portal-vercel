/**
    Duel S.p.A.

    Lista dei servizi TPL.

    Revision history

    | Data       | Autore | Descrizione 
    | ---------- | ------ | ----------------------------------- |
    | 2021/08/10 | Duel   | Prima versione                      |
*/

import Link from "next/link"
import styles from './MIPTPL.module.scss'

const services = [
    {
        id: 1,
        category: 'Autobus',
        brand: 'Grandabus',
        provinces: 'Torino, Alessandria, Asti, Biella, Cuneo, Novara, Vercelli, Verbano-Cusio-Ossola',
        logo_url: '/logos/grandabus_logo.png',
        link: 'https://grandabus.it/'
    },
    {
        id: 2,
        category: 'Treni',
        brand: 'Ferrovie dello Stato',
        provinces: 'Tuttle le province italiane',
        logo_url: '/logos/fs_logo.png',
        link: 'https://www.fsitaliane.it/'
    },
    {
        id: 3,
        category: 'Autobus',
        brand: 'Grandabus',
        provinces: 'Torino, Alessandria, Asti, Biella, Cuneo, Novara, Vercelli, Verbano-Cusio-Ossola',
        logo_url: '/logos/grandabus_logo.png',
        link: 'https://grandabus.it/'
    },
    {
        id: 4,
        category: 'Treni',
        brand: 'Ferrovie dello Stato',
        provinces: 'Tuttle le province italiane',
        logo_url: '/logos/fs_logo.png',
        link: 'https://www.fsitaliane.it/'
    },
    {
        id: 5,
        category: 'Autobus',
        brand: 'Grandabus',
        provinces: 'Torino, Alessandria, Asti, Biella, Cuneo, Novara, Vercelli, Verbano-Cusio-Ossola',
        logo_url: '/logos/grandabus_logo.png',
        link: 'https://grandabus.it/'
    },
    {
        id: 6,
        category: 'Treni',
        brand: 'Ferrovie dello Stato',
        provinces: 'Tuttle le province italiane',
        logo_url: '/logos/fs_logo.png',
        link: 'https://www.fsitaliane.it/'
    },
    {
        id: 7,
        category: 'Autobus',
        brand: 'Grandabus',
        provinces: 'Torino, Alessandria, Asti, Biella, Cuneo, Novara, Vercelli, Verbano-Cusio-Ossola',
        logo_url: '/logos/grandabus_logo.png',
        link: 'https://grandabus.it/'
    },
    {
        id: 8,
        category: 'Treni',
        brand: 'Ferrovie dello Stato',
        provinces: 'Tuttle le province italiane',
        logo_url: '/logos/fs_logo.png',
        link: 'https://www.fsitaliane.it/'
    },
    {
        id: 9,
        category: 'Autobus',
        brand: 'Grandabus',
        provinces: 'Torino, Alessandria, Asti, Biella, Cuneo, Novara, Vercelli, Verbano-Cusio-Ossola',
        logo_url: '/logos/grandabus_logo.png',
        link: 'https://grandabus.it/'
    },
]

function MIPTPLServiceCard({ service }) {
    return (
        <div className={styles.tpl_service_card}>
            <div>
                <p className={styles.category}>{service.category}</p>
                <h4 className={styles.company}>{service.brand}</h4>
                <p className={styles.subtitle}>province servite</p>
                <p className={styles.provinces}>{service.provinces}</p>
            </div>
            <div className={styles.footer}>
                <img src={service.logo_url} alt={service.brand} />
                <Link href={service.link || 'https://grandabus.it/'}><a className={styles.link} target="_blank" rel="noreferrer noopener">vai al sito</a></Link>
            </div>
        </div>
    )
}

const provinces = [
    'Alesssandria',
    'Asti',
    'Biella',
    'Cuneo',
    'Novara',
    'Torino',
    'Verbano Cusio Ossola',
    'Vercelli'
]

export default function MIPTPLServiceList(props) {
    const className = `${props.className || ''} ${styles.tpl_service_list}`
    return (
        <div className={className}>
            <div className={styles.toolbar}>
                <div className={styles.input_container}>
                    <input className={styles.dropdown} list="provinces" name="province" id="province" placeholder="Filtra per provincia" />
                    <datalist id="provinces">
                        {provinces.map(prov =>
                            <option key={prov} value={prov}>{prov}</option>
                        )}
                    </datalist>
                </div>
            </div>
            <div className={styles.container}>
                {services.map(service =>
                    <MIPTPLServiceCard key={service.id} service={service} />
                )}
            </div>
        </div>
    )
}
