/**
    Duel S.p.A.

    Tab bar con informazioni di traffico complete e calcolo percorso.

    Revision history

    | Data       | Autore | Descrizione 
    | ---------- | ------ | ----------------------------------- |
    | 2021/08/10 | Duel   | Prima versione                      |
*/
import { Tab } from '@headlessui/react'

import MIPPathDataPanel from "../path/MIPPathDataPanel"
import MIPTrafficEventListForm from './MIPTrafficEventListForm'

export default function MIPTrafficTabPanel({ className, selected, trafficEventData }) {
    //const className = `${props.className || ''} ${styles.traffic_tab_panel}`
    return (
        <div className={className}>
            <Tab.Group defaultIndex={selected} as="div" className="mip-tab-group">
                <Tab.List className="mip-tab-list">
                    <Tab key="path" as="h4"
                        className="mip-bg-blue mip-tab-header mip-tl-rounded-corners mip-path-icon">
                        Percorso
                    </Tab>
                    <Tab key="traffic" as="h4"
                        className="mip-bg-accent mip-tab-header mip-traffic-icon">
                        Traffico
                    </Tab>
                </Tab.List>
                <Tab.Panels className="mip-tab-panel">
                    <Tab.Panel>
                        <MIPPathDataPanel />
                    </Tab.Panel>
                    <Tab.Panel className="mip-vertical-scroll">
                        <MIPTrafficEventListForm className="mip-wh-100" trafficEventData={trafficEventData} />
                    </Tab.Panel>
                </Tab.Panels>
            </Tab.Group>
        </div>
    )
}