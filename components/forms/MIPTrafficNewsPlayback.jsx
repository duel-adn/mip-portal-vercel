/**
    (C) Duel srl 2021.

    Componente per il playback del bollettino.

    Revision history

    | Data       | Autore | Descrizione 
    | ---------- | ------ | ----------------------------------- |
    | 2021/08/10 | Duel   | Prima versione                      |
*/

import styles from './MIPForms.module.scss'

function togglePlay() {
    const player = document.getElementById('notiziario')
    if (player) {
        if (player.paused || player.ended) {
            player.play()
        } else {
            player.pause()
        }
    } else {
        console.log('no player object')
    }
}

function displayProgress() {
    const progress = document.getElementById('progress')
    const player = document.getElementById('notiziario')
    if ((progress !== undefined) && (player !== undefined)) {
        if (player.paused) {
            progress.classList.add("mip-d-none")
        } else {
            progress.classList.remove("mip-d-none")
        }
        let pct= 1 - ((player.duration - player.currentTime) / player.duration)
        progress.value = pct
    }
}

/**
 * 
 * @param {*} props property dell'elemento
 * @param {string} audioUrl url dell'audio da utilizzare
 */
export default function MIPTrafficNewsPlayback(props) {
    return (
        <div className={styles.playback_container}>
        <button className={styles.traffic_news_btn} onClick={() => togglePlay()}>
            Ascolta il notiziario sul traffico
        </button>
        <audio id="notiziario" src={props.audioUrl}
            onTimeUpdate={() => displayProgress()}>No audio</audio>   
        <progress id="progress" className={`${styles.progress} mip-d-none`} />
        </div>
    )
}