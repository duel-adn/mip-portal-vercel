/**
    (C) Duel srl 2021.

    Gestione del contesto del portale

    Revision history

    | Data       | Autore | Descrizione 
    | ---------- | ------ | ----------------------------------- |
    | 2021/11/03 | Duel   | Prima versione                      |
*/

import React from "react"

// Contesto del portale MIP
// Usato per scambiare informazioni tra i vari pannelli

const initialContext = {
    trafficEventData: [],  // eventi di traffico
}

const MIPContext = React.createContext(initialContext)