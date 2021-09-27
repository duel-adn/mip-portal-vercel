/**
    Duel S.p.A.

    Home page portale

    Revision history

    | Data       | Autore | Descrizione 
    | ---------- | ------ | ----------------------------------- |
    | 2021/08/10 | Duel   | Prima versione                      |
*/

import link from 'next/link';
import Link from 'next/link'
import MIPPage from '../components/page/MIPPage';

const links = [
  {
    title: 'Errore 404',
    url: '/not-existing-page'
  },
  {
    title: 'Home page',
    url: '/'
  },
  {
    title: 'Traffico in tempo reale',
    url: '/traffic'
  },
  {
    title: 'Mobilità alternativa',
    url: '/mobility'
  },
  {
    title: 'Template archivio',
    url: '/news'
  },
  {
    title: 'Template articolo',
    url: '/article'
  },
  {
    title: 'Trasporto pubblico locale',
    url: '/tpl'
  },
  {
    title: 'Radio',
    url: '/radio'
  },
  {
    title: 'Bando',
    url: '/bid'
  },
  {
    title: 'Contatti',
    url: '/contacts'
  },
  {
    title: 'Il servizio',
    url: '/service'
  },
  {
    title: 'Cookies',
    url: '/cookies'
  },
  {
    title: 'Disclaimer',
    url: '/disclaimer'
  },
  {
    title: 'Informazioni privacy',
    url: '/privacy'
  },
]

export default function Home(props) {
  return (
    <MIPPage 
      pageTitle="Pagina di test"
      title="Pagina di test" 
        titleClassName="mip-bg-accent"
        breadcrumb="indietro">
        <h2>Link alle pagine del portale</h2>
        <ol className="mip-ml-4 mip-mt-2">
        {links.map(l =>
          <li key={l.title}><Link href={l.url}><a>{l.title}</a></Link></li>
        )}
        </ol>
    </MIPPage>
  )
}
