/**
    (C) Duel srl 2021.

    Header completo delle pagine (toolbar + navbar)

    Revision history

    | Data       | Autore | Descrizione 
    | ---------- | ------ | ----------------------------------- |
    | 2021/08/10 | Duel   | Prima versione                      |
*/
import styles from './MIPHeader.module.scss'
import MipToolbar from "./MIPToolbar"
import MIPNavbar from "./MIPNavbar"

export default function MIPPageHeader(props) {
    const titleClass = `${props.titleClassName || ''} ${styles.page_title}`
    const breadcrumbClass = `mip-bg-light mip-page-row ${styles.breadcrumb}`
    return (
        <header className={props.className}>
            <div className="mip-bg-dark">
                <MipToolbar className="mip-page-row" />
            </div>
            <div className="mip-bg-light">
                <MIPNavbar className="mip-page-row" />
            </div>
            { props.title &&
                <div className={titleClass}>
                    <h1 className="mip-page-row">{props.title}</h1>
                </div>
            }
            { props.breadcrumb &&
                <div className={breadcrumbClass}>
                    <a>{props.breadcrumb}</a>
                </div>
            }
        </header>
    )
}
