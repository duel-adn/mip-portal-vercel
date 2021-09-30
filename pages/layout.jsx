import MIPPage from '../components/page/MIPPage'
import { fetchPassData } from '../components/pass/MIPPassDataList'
import MIPPassDataPanel from '../components/pass/MIPPassDataPanel'

export default function Home({passData}) {
    return (
        <MIPPage className="mip-home-page1" 
          pageTitle="Layout test">
          <MIPPassDataPanel 
            headerClassName="mip-tl-rounded-corners mip-bg-accent"
            contentClassName="mip-bl-rounded-corners mip-bg-light"
            title="Colli alpini"
            titleIcon="traffic"
            subtitle="Scopri informazioni su colli e trafori"
            enableSearch={true}
            searchPlaceholder="Seleziona un colle" 
            passData={passData}/>
        </MIPPage>
    )
}

export async function getStaticProps(context) {
  const passData = await fetchPassData(context)

  return {
      props: {
        passData
    }
  }
}
  