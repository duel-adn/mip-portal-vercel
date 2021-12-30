/**
    (C) Duel srl 2021.

    Componenti per la gestione delle pagine

    Revision history

    | Data       | Autore | Descrizione 
    | ---------- | ------ | ----------------------------------- |
    | 2021/08/10 | Duel   | Prima versione                      |
*/

import 'react-toastify/dist/ReactToastify.css';
import Head from "next/head"
import { ToastContainer } from 'react-toastify';
import { mipConcatenate } from "../../lib/MIPUtility"
import MIPPageFooter from '../footer/MIPPageFooter'
import MIPPageHeader from '../header/MIPResponsiveHeader'

/**
 * Il template base di un pagina MIP
 * 
 * @param {String} className classe da aggiungere all'elemento esterno 
 * @param {String} pageTitle titolo della pagina
 * @param {String} breadcrumb testo del breadcrumb (se null, il breadcrumb non viene visualizzato)
 * @param {String} title testo del titolo nell'header
 * @param {String} breadcrumb testo del breadcrumb (se null, il breadcrumb non viene visualizzato)
 * @param {*} children elementi interni, da visualizzare nel main
 * @returns 
 */
function MIPPageTemplate({ className, pageTitle, title, titleClassName, breadcrumb, children }) {
    const finalClassName = mipConcatenate(className, "mip-page-section")
    return (
        <>
            <MIPPageHead title={pageTitle} />
            <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss={false}
                draggable
                pauseOnHover
            />
            <div className="mip-page-container">
                <MIPPageHeader className="mip-w-100" breadcrumb={breadcrumb}
                    title={title} titleClassName={titleClassName} />
                <main className={finalClassName}>
                    {children}
                </main>
                <MIPPageFooter className="mip-mt-auto mip-w-100" />
            </div>
        </>
    )
}

/**
 * Elementi aggiuntivi da inserire nella sezione <head>
 * @param {String} title titolo della pagina
 * @returns 
 */
function MIPPageHead({ title }) {
    return (
        <Head>
            <title>{title || 'Muoversi in Piemonte'}</title>
            <link rel="icon" href="/favicon.ico" />
        </Head>
    )
}

const MIPage = {
    Page: MIPPageTemplate,
    Head: MIPPageHead
}

export default MIPage;