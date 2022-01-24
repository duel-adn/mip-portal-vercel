/**
    (C) Duel srl 2021.

    Stili per i pannello altri servizi di MIP.

    Revision history

    | Data       | Autore | Descrizione 
    | ---------- | ------ | ----------------------------------- |
    | 2021/08/10 | Duel   | Prima versione                      |
*/

import styles from './MIPService.module.scss'

import Link from 'next/link'

import useTranslation from 'next-translate/useTranslation'

const serviceData = [
    {
        id: 1,
        title: "PassesTitle",
        subtitle: "PassesSubtitle",
        icon: "/icons/colli-alpini.svg",
        url: "/passes",
        external: false
    },
    {
        id: 2,
        title: "TrainsTimetableTitle",
        subtitle: "TrainsTimetableSubtitle",
        icon: "/icons/train-timetable.svg",
        url: "http://www.viaggiatreno.it/viaggiatrenonew/index.jsp?idreg=3",
        external: true
    },
    {
        id: 3,
        title: "FlightScheduleTitle",
        subtitle: "FlightScheduleSubtitle",
        icon: "/icons/flight-timetable.svg",
        url: "https://www.aeroportoditorino.it/it",
        external: true
    },
    {
        id: 4,
        title: "VisitUsTitle",
        subtitle: "VisitUsSubtitle",
        icon: "/icons/visita-piemonte.svg",
        url: "https://www.visitpiemonte.com/it",
        external: true
    },
]

function MIPServiceCard({service, cta}) {
    const style = {
        backgroundImage:`url(${service.icon})`
    }
    return (
    <div className={styles.service_card}>
        <h2 className={styles.title}>{service.title}</h2>
        <p className={styles.description}>{service.subtitle}</p>
        <div style={style} className={styles.toolbar}>
            {service.external ?
                <a href={service.url} target="_blank" rel="noopener noreferrer">{cta}</a>
                :
                <Link href={service.url}><a>{cta}</a></Link>
            }
        </div>
    </div>
    )
}

export default function MIPServicePanel(props) {
    const className = `${props.className || ''} ${styles.service_panel}`;
    const { t, tl } = useTranslation('common')
    const translatedServices = serviceData.map(s => ({
        id: s.id,
        title: t(s.title),
        subtitle: t(s.subtitle),
        icon: s.icon,
        url: s.url,
        external: s.external
    }))
    return (
    <div className={className}>
        {
            translatedServices.map(service => 
                <MIPServiceCard key={service.id} service={service} cta={t("ServiceCta")}/>
            )
        }
    </div>
    )
}