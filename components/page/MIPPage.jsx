/**
    (C) Duel srl 2021.

    Componenti per la gestione delle pagine

    Revision history

    | Data       | Autore | Descrizione 
    | ---------- | ------ | ----------------------------------- |
    | 2021/08/10 | Duel   | Prima versione                      |
*/

import Head from "next/head"
import MIPPageFooter from '../footer/MIPPageFooter'
import MIPPageHeader from '../header/MIPResponsiveHeader'

function MIPPage(props) {
    const className = `${props.className || ''} mip-page-section`
    return (
        <>
        <MIPPageHead title={props.pageTitle} />
        <div className="mip-page-container">
            <MIPPageHeader className="mip-w-100" breadcrumb={props.breadcrumb}
                title={props.title} titleClassName={props.titleClassName}/>
            <main className={className}>
                {props.children}
            </main>
            <MIPPageFooter className="mip-mt-auto mip-w-100"/>
        </div>
        </>
    )
}

function MIPPageHead(props) {
    return (
    <Head>
        <title>{props.title || 'Muoversi in Piemonte'}</title>
        <link rel="icon" href="/favicon.ico" />
    </Head>
    )
}

export default {
    Page: MIPPage,
    Head: MIPPageHead
}