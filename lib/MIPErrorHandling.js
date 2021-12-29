/**
    (C) Duel srl 2021.

    Procedure di gestione errori

    Revision history

    | Data       | Autore | Descrizione 
    | ---------- | ------ | ----------------------------------- |
    | 2021/11/03 | Duel   | Prima versione                      |
*/

export function mipCreateError(context, errorCode, errorMessage) {
    return {
        error: {
            context: context,
            errorCode: errorCode,
            originalMessage: errorMessage,
            localizedMessage: null
        }
    }
}

