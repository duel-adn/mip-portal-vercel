/**
    (C) Duel srl 2021.

    Pagina delle notizie del trasporto pubblico locale.

    Revision history

    | Data       | Autore | Descrizione 
    | ---------- | ------ | ----------------------------------- |
    | 2021/08/10 | Duel   | Prima versione                      |
*/

import MIPPage from '../components/page/MIPPage'
import MIPRadioList from '../components/services/MIPRadio'

const radioList = [
  {
    name: "Disco Radio",
    url: "http://www.discoradio.it"
  },
  {
    name: "GRP Televisione",
    url: "http://www.grptv.it/i-canali/grp-1"
  },
  {
    name: "Party Radio",
  },
  {
    name: "Radio Alba",
    url: "http://www.radioalba.it/"
  },
  {
    name: "Radio Alfa Canavese",
    url: "http://www.radioalfacanavese.it"
  },
  {
    name: "Radio Amica",
  },
  {
    name: "Radio Antenna Uno",
    url: "http://www.antennaunoradio.com/"
  },
  {
    name: "Radio Beckwith Evangelica",
    url: "http://rbe.it"
  },
  {
    name: "Radio Canelli e Monferrato",
    url: "http://www.radiocanelli.it"
  },
  {
    name: "Radio Cuneo Nord",
    url: "http://www.radiocuneonord.it"
  },
  {
    name: "Radio Dora",
    url: "http://www.radiodora.it"
  },
  {
    name: "Radio Dream on Fly",
    url: "https://www.radiodreamonfly.it/"
  },
  {
    name: "Radio Energy",
    url: "http://www.radioenergy.to"
  },

  {
    name: "Radio Frejus",
    url: "http://www.radiofrejus.it",
  },
  {
    name: "Radio Gran Paradiso",
    url: "http://www.radiogranparadiso.it",
  },
  {
    name: "Radio in store Banca di Asti e Biverbanca",
  },
  {
    name: "Radio Italia Anni 60",
    url: "http://www.radioitaliaannisessanta.it",
  },
  {
    name: "Radio Italia Uno",
    url: "http://www.radioitaliauno.org",
  },
  {
    name: "Radio Liberty FM",
    url: "http://www.libertyfm.it",
  },
  {
    name: "Radio Manila",
    url: "http://www.radiomanilafm.it/",
  },
  {
    name: "Radio Musica Television",
    url: "http://www.radiomusicatv.it/",
  },
  {
    name: "Radio Nostalgia",
    url: "https://www.nostalgia.it/",
  },
  {
    name: "Radio Onda Novara",
    url: "http://www.ondanovara.it",
  },
  {
    name: "Radio Piemonte Sound",
    url: "http://www.radiopiemontesound.it",
  },
  {
    name: "Radio Shake Hit",
  },
  {
    name: "Radio Stella Piemonte",
    url: "http://www.radiostellapiemonte.net/ ",
  },
  {
    name: "Radio Studio 92",
    url: "http://www.radiostudio92.it"
},
{
    name: "Radio Torino",
    url: "http://www.radiotorinofm.it"
},
{
    name: "Radio Veronica One ",
    url: "http://www.radioveronicaone.it"
},
{
    name: "Radio ValleBelbo ",
    url: "http://www.radiovallebelbo.it"
},
{
    name: "Radio VanD’a ",
    url: "http://www.radiovanda.it/"
},
{
    name: "Radio Vega ",
    url: "http://www.radiovega.it"
},
{
    name: "Radio Voce Spazio ",
    url: "http://www.radiovocespazio.it/ "
},
{
    name: "RVL – La Radio",
    url: "http://www.rvl.it"
},
{
    name: "Susa Onda Radio",
    url: "http://susaondaradio.it/"
},
{
    name: "TOradio",
    url: "https://toradio.it/"
},
{
    name: "Torino International",
    url: "http://www.torinointernational.com"
},
{
    name: "TRS Radio",
    url: "http://www.trsradio.it/"
},

]
export default function Radio(props) {
  return (
    <MIPPage.Page
      pageTitle="Radio"
      title="Radio"
      titleClassName="mip-bg-blue"
      breadcrumb='Indietro'>
      <p className="mip-my-2">Il notiziario del traffico può essere ascoltato anche sulle radio:</p>
      <MIPRadioList className="mip-3col-page" radioList={radioList}/>
    </MIPPage.Page>
  )
}
