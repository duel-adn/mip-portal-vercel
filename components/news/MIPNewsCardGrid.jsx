/**
    (C) Duel srl 2021.

    Griglia con card per pagina news.

    Revision history

    | Data       | Autore | Descrizione 
    | ---------- | ------ | ----------------------------------- |
    | 2021/08/10 | Duel   | Prima versione                      |
*/

import styles from './MIPNews.module.scss'
import Link from 'next/link'
import useTranslation from 'next-translate/useTranslation'

function MIPSimpleNewsCard({news}) {
    const { t } = useTranslation('common')
    return (
        <div className={styles.simple_news_card}>
            <div className="mip-tag mip-bg-dark-blue mip-mt-1">{news.type}</div>
            <h3 className={styles.title}>{news.title}</h3>
            <div className={styles.content} dangerouslySetInnerHTML={{__html: news.description}}></div>
            <div className={styles.toolbar}>
            <div>{news.validitystart + (news.validityend ? ` - ${news.validityend}` : '')}</div>
                <Link href={`${news.id}`}><a>{t("ReadAll")}</a></Link>
            </div>
        </div>
    )
}

function MIPNewsCard({news, hideImages}) {
    const { t } = useTranslation('common')
    return (
        <div className={styles.news_card}>
            {
                hideImages ||
                <img className={styles.thumbnail} src={news.thumbnail} alt={news.thumbnail_alt}/>
            }
            <div className="mip-tag mip-bg-dark-blue mip-mt-1">{news.tag}</div>
            <h3 className={styles.title}>{news.title}</h3>
            <div className={styles.content} dangerouslySetInnerHTML={{__html: news.description}}></div>

            <div className={styles.footer}>
            <div>{news.validitystart + (news.validityend ? ` - ${news.validityend}` : '')}</div>

                <Link href={`${news.id}`}><a>{t("ReadAll")}</a></Link>
            </div>
        </div>
    )
}

export default function MIPNewsCardGrid({className, articles, simple}) {
    const completeClassName = `${className || ''} ${styles.news_card_grid}`;
    const newsList = articles
    return (
        <div className={completeClassName}>
            { newsList?.map((news, index) => 
                (simple ? <MIPSimpleNewsCard key={news.id || index} news={news}/> :
                    <MIPNewsCard key={news.id || index} news={news}/>)
                )
            }
        </div>
    )
}