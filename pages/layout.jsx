/**
    (C) Duel srl 2021.

    Pagina di test del layout.

    Revision history

    | Data       | Autore | Descrizione 
    | ---------- | ------ | ----------------------------------- |
    | 2021/08/10 | Duel   | Prima versione                      |
*/
import { useState } from 'react'
import { Tab } from '@headlessui/react'
import MIPPage from '../components/page/MIPPage'
import MIPPathDataPanel from '../components/path/MIPPathDataPanel'
import MIPTrafficEventListForm from '../components/traffic/MIPTrafficEventListForm'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Layout({ passData }) {
  return (
    <MIPPage className="mip-home-page1"
      pageTitle="Layout test">
      <Tab.Group>
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
        <Tab.Panel>
              <MIPPathDataPanel />
          </Tab.Panel>
          <Tab.Panel>
              <MIPTrafficEventListForm />
          </Tab.Panel>
        <Tab.Panels>
        </Tab.Panels>
      </Tab.Group>
    </MIPPage>
  )
}
