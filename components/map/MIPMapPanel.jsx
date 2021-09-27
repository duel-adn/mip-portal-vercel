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

function loading() {
  return <p>A map is loading</p>
}
const DynamicMap = dynamic(
    () => import('./MIPMap'), // replace '@components/map' with your component's location
    { 
      loading: loading,
      ssr: false // This line is important. It's what prevents server-side render
    }
  )

  /**
   * Pannello mappa con layer configurabili
   * 
   * @param {*} props proprietà del compoente
   * @param {*} props.trafficEventData array con i dati di traffico
   * @returns 
   */
export default function MIPMapPanel(props) {
  const className = `${props.className || ''} ${styles.map_container}`
  return (
      <div className={className}>
        <DynamicMap trafficEvents={props.trafficEventData} />
      </div>
    )
}