/**
    (C) Duel srl 2021.

    Head standard di tutte le pagine.

    Revision history

    | Data       | Autore | Descrizione 
    | ---------- | ------ | ----------------------------------- |
    | 2021/08/10 | Duel   | Prima versione                      |
*/

import Head from "next/head"

export default function MIPPageHead(props) {
    return (
    <Head>
        <title>{props.title || 'Muoversi in Piemonte'}</title>
        <link rel="icon" href="/favicon.ico" />
    </Head>
    )
}