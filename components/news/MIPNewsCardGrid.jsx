/**
    (C) Duel srl 2021.

    Griglia con card per pagina news.

    Revision history

    | Data       | Autore | Descrizione 
    | ---------- | ------ | ----------------------------------- |
    | 2021/08/10 | Duel   | Prima versione                      |
*/

import Link from 'next/link'
import styles from './MIPNews.module.scss'

const newsList = [
    {
        thumbnail: '/news-images/news-thumb-3.png',
        thumbnail_alt: 'montagna innevata',
        tag: 'news',
        date: '15 settembre 2021',
        title: 'Aperta la stagione sciistica sulle più belle vette del Piemonte',
        content: 'L\'edizione 104 della corsa rosa prenderà il via l\'8 maggio dal capoluogo piemontese con (...)'
    },
    {
        thumbnail: '/news-images/news-thumb-1.png',
        thumbnail_alt: 'foto aerea della A1',
        tag: 'news',
        date: '13 settembre 2021',
        title: 'Tir, perdita carico in autostrada A1',
        content: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Minus consectetur nihil fuga ipsa autem soluta, corporis, eligendi facilis eum quis quam. '
    },
    {
        thumbnail: '/news-images/news-thumb-2.png',
        thumbnail_alt: 'pendolari in attesa',
        tag: 'news',
        date: '10 settembre 2021',
        title: 'Capienza al 60% su i mezzi pubblici del capoluogo',
        content: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Minus consectetur nihil fuga ipsa autem soluta, corporis, eligendi facilis eum quis quam. '
    },
    {
        thumbnail: '/news-images/news-thumb-4.png',
        thumbnail_alt: 'arrivo giro d\'italia',
        tag: 'news',
        date: '15 giugno 2021',
        title: 'Torino ospita la partenza del Giro d’Italia 2021',
        content: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Minus consectetur nihil fuga ipsa autem soluta, corporis, eligendi facilis eum quis quam. '
    },
    {
        thumbnail: '/news-images/news-thumb-2.png',
        thumbnail_alt: 'pendolari in attesa',
        tag: 'news',
        date: '30 settembre 2021',
        title: 'Capienza al 60% su i mezzi pubblici del capoluogo',
        content: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Minus consectetur nihil fuga ipsa autem soluta, corporis, eligendi facilis eum quis quam. '
    },
    {
        thumbnail: '/news-images/news-thumb-3.png',
        thumbnail_alt: 'montagna innevata',
        tag: 'news',
        date: '15 ottobre 2021',
        title: 'Aperta la stagione sciistica sulle più belle vette del Piemonte',
        content: 'L\'edizione 104 della corsa rosa prenderà il via l\'8 maggio dal capoluogo piemontese con (...)'
    },
    {
        thumbnail: '/news-images/news-thumb-1.png',
        thumbnail_alt: 'foto aerea della A1',
        tag: 'news',
        date: '13 agosto 2021',
        title: 'Tir, perdita carico in autostrada A1',
        content: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Minus consectetur nihil fuga ipsa autem soluta, corporis, eligendi facilis eum quis quam. '
    },
    {
        thumbnail: '/news-images/news-thumb-2.png',
        thumbnail_alt: 'pendolari in attesa',
        tag: 'news',
        date: '7 luglio 2021',
        title: 'Capienza al 60% su i mezzi pubblici del capoluogo',
        content: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Minus consectetur nihil fuga ipsa autem soluta, corporis, eligendi facilis eum quis quam. '
    },
    {
        thumbnail: '/news-images/news-thumb-2.png',
        thumbnail_alt: 'pendolari in attesa',
        tag: 'news',
        date: '8 settembre 2021',
        title: 'Capienza al 60% su i mezzi pubblici del capoluogo',
        content: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Minus consectetur nihil fuga ipsa autem soluta, corporis, eligendi facilis eum quis quam. '
    },
    {
        thumbnail: '/news-images/news-thumb-4.png',
        thumbnail_alt: 'arrivo giro d\'italia',
        tag: 'news',
        date: '18 settembre 2021',
        title: 'Torino ospita la partenza del Giro d’Italia 2021',
        content: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Minus consectetur nihil fuga ipsa autem soluta, corporis, eligendi facilis eum quis quam. '
    },
    {
        thumbnail: '/news-images/news-thumb-2.png',
        thumbnail_alt: 'pendolari in attesa',
        tag: 'news',
        date: '28 agosto 2021',
        title: 'Capienza al 60% su i mezzi pubblici del capoluogo',
        content: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Minus consectetur nihil fuga ipsa autem soluta, corporis, eligendi facilis eum quis quam. '
    },
    {
        thumbnail: '/news-images/news-thumb-3.png',
        thumbnail_alt: 'montagna innevata',
        date: '28 febbraio 2021',
        tag: 'news',
        title: 'Aperta la stagione sciistica sulle più belle vette del Piemonte',
        content: 'L\'edizione 104 della corsa rosa prenderà il via l\'8 maggio dal capoluogo piemontese con (...)'
    },
]

function MIPSimpleNewsCard({news}) {
    return (
        <div className={styles.simple_news_card}>
            <div className="mip-tag mip-bg-light-blue mip-mt-1">{news.tag}</div>
            <h3 className={styles.title}>{news.title}</h3>
            <p className={styles.content}>{news.content}</p>
            <div className={styles.toolbar}>
                <p>{news.date}</p>
                <Link href="/article"><a>Leggi di più</a></Link>
            </div>
        </div>
    )
}

function MIPNewsCard({news, hideImages}) {
    return (
        <div className={styles.news_card}>
            {
                hideImages ||
                <img className={styles.thumbnail} src={news.thumbnail} alt={news.thumbnail_alt}/>
            }
            <div className="mip-tag mip-bg-dark-blue mip-mt-1">{news.tag}</div>
            <h3 className={styles.title}>{news.title}</h3>
            <p className={styles.content}>{news.content}</p>
            <div className={styles.toolbar}>
                <p>{news.date}</p>
                <Link href="/article"><a>Leggi di più</a></Link>
            </div>
        </div>
    )
}

export default function MIPNewsCardGrid(props) {
    const className = `${props.className || ''} ${styles.news_card_grid}`;
    const maxNews = props.maxNews || 1000;
    return (
        <div className={className}>
            { newsList.map((news, index) => 
                index < maxNews &&
                (props.simple ? <MIPSimpleNewsCard news={news}/> :
                <MIPNewsCard news={news}/>)
                )
            }
        </div>
    )
}