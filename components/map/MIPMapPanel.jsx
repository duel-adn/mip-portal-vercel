/**
    Duel S.p.A.

    Pannello con mappa

    Revision history

    | Data       | Autore | Descrizione 
    | ---------- | ------ | ----------------------------------- |
    | 2021/08/10 | Duel   | Prima versione                      |
*/

import dynamic from 'next/dynamic'
import styles from './MIPMap.module.scss'

export function MIPMapLoadPlaceholder() {
  return <p>A map is loading</p>
}
  /**
   * Pannello mappa con layer configurabili
   * 
   * @param {*} props  
   * @returns 
   */
export default function MIPMapPanel({className, children}) {
  const myclassName = `${className || ''} ${styles.map_container}`
  const DynamicMap = dynamic(
    () => import('./MIPMap'), // replace '@components/map' with your component's location
    { 
      loading: MIPMapLoadPlaceholder,
      ssr: false // This line is important. It's what prevents server-side render
    }
  )

  return (
      <div className={myclassName}>
        { children || 
          <DynamicMap />
        }
      </div>
    )
}