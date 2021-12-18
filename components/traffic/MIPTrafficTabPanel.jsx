/**
    Duel S.p.A.

    Tab bar con informazioni di traffico complete e calcolo percorso.

    Revision history

    | Data       | Autore | Descrizione 
    | ---------- | ------ | ----------------------------------- |
    | 2021/08/10 | Duel   | Prima versione                      |
*/
import { Tab } from '@headlessui/react'

import useTranslation from 'next-translate/useTranslation'

import MIPPath from '../path/MIPPath'
import MIPTraffic from './MIPTraffic'

export default function MIPTrafficTabPanel({ className, selected, trafficEventData }) {
    const { t, tl } = useTranslation('traffic')
    return (
        <div className={className}>
            <Tab.Group defaultIndex={selected} as="div" className="mip-tab-group">
                <Tab.List className="mip-tab-list">
                    <Tab key="path" as="h4"
                        className="mip-bg-blue mip-tab-header mip-tl-rounded-corners mip-path-icon">
                        Calcola percorso
                    </Tab>
                    <Tab key="traffic" as="h4"
                        className="mip-bg-accent mip-tab-header mip-traffic-icon">
                        {t("Traffic")}
                    </Tab>
                </Tab.List>
                <Tab.Panels className="mip-tab-panel">
                    <Tab.Panel>
                        <MIPPath.Controller />
                    </Tab.Panel>
                    <Tab.Panel className="mip-h-100">
                        <MIPTraffic.EventCardList className="mip-wh-100-" searchable trafficEventData={trafficEventData} />
                    </Tab.Panel>
                </Tab.Panels>
            </Tab.Group>
        </div>
    )
}