/**
    (C) Duel srl 2021.

    Header completo delle pagine (toolbar + navbar)

    Revision history

    | Data       | Autore | Descrizione 
    | ---------- | ------ | ----------------------------------- |
    | 2021/08/10 | Duel   | Prima versione                      |
*/
import MipToolbar from "../header/MIPToolbar"
import MIPNavbar from "../header/MIPNavbar"

export default function MIPPageHeader(props) {
    return (
        <header className="mip-page-section">
            <div className="mip-bg-dark">
                <MipToolbar className="mip-page-row" />
            </div>
            <div className="mip-bg-light">
                <MIPNavbar className="mip-page-row" />
            </div>
        </header>
    )
}
