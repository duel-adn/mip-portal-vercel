/**
    (C) Duel srl 2021.

    Pagina delle news.

    Revision history

    | Data       | Autore | Descrizione 
    | ---------- | ------ | ----------------------------------- |
    | 2021/08/10 | Duel   | Prima versione                      |
*/

import Link from 'next/link'
import MIPPage from '../components/page/MIPPage'

export default function MobilityNews(props) {
  return (
      <MIPPage className="mip-flex-row" 
      pageTitle="Bando di gara"
      title="Bando" 
        titleClassName="mip-bg-blue"
        breadcrumb='Indietro'>
        <img src="/news-images/bid-header.jpg" width="100%" height="auto" alt="città di torino"/>
        <header className="article-title">
      <h2 className="mip-mt-2">Titolo del bando/gara</h2>
        <div className="mip-my-2">
        <span className="mip-tag mip-bg-dark mit-mr-2">Concluso</span>
        <span className="mip-tag mip-bg-light-blue">Graduatorie disponibili</span>
        </div>
      </header>
        <article className="mip-mt-2">
          <p><b>Lorem ipsum dolor sit amet</b></p>
          <p className="mip-mb-2">Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos nesciunt quis voluptatum magni pariatur cumque velit, aspernatur, iusto, optio tenetur nisi vero facilis perspiciatis molestiae ducimus nemo! Cupiditate, quo provident.</p>
          <p className="mip-mb-2">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Maxime mollitia magnam, corporis quas adipisci odio vel quae, voluptas repellat est quo enim eaque, fuga numquam aspernatur deserunt id itaque quaerat!</p>
          <p className="mip-mb-2">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Itaque odit quis veritatis non sit aut a reiciendis animi minima optio laudantium dolores cupiditate obcaecati quasi sunt nam, qui magni vitae.</p>
        </article>
        <section className="mip-my-2">
          <h2 className="mip-my-2">Scarica gli allegati</h2>
          <ul className="mip-mb-2">
          <li><Link href="#"><a className="mip-attachment-link">Regolamento Weekend Sostebile</a></Link></li>
          <li><Link href="#"><a className="mip-attachment-link">Liberatoria</a></Link></li>
          <li><Link href="#"><a className="mip-attachment-link">Graduatoria</a></Link></li>
          </ul>
        </section>
      </MIPPage>
  )
}
