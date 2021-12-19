/**
    Duel S.p.A.

    Pannello con mappa di traffico

    Revision history

    | Data       | Autore | Descrizione 
    | ---------- | ------ | ----------------------------------- |
    | 2021/08/10 | Duel   | Prima versione                      |
*/

import dynamic from 'next/dynamic'
import MIPMapPanel, { MIPMapLoadPlaceholder }  from '../map/MIPMapPanel'

export default function MIPPlanMapPanel({className }) {
    const DynamicMap = dynamic(
        () => import('./MIPPathMap'), // replace '@components/map' with your component's location
        { 
            loading: MIPMapLoadPlaceholder,
          ssr: false // This line is important. It's what prevents server-side render
        }
      )
    return (
        <MIPMapPanel className={className}>
            <DynamicMap />
        </MIPMapPanel>
    )
}