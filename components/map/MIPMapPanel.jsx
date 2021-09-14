import dynamic from 'next/dynamic'

const MIPMap = dynamic(
    () => import('./MIPMap'), // replace '@components/map' with your component's location
    { 
      loading: () => <p>A map is loading</p>,
      ssr: false // This line is important. It's what prevents server-side render
    }
  )

  export default function MIPMapPanel(props) {
      return (
        <div className={props.className}>
          <MIPMap trafficEvents={props.trafficEventData} />
        </div>
      )
  }