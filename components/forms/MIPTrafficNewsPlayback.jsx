/**
    (C) Duel srl 2021.

    Componente per il playback del bollettino.

    Revision history

    | Data       | Autore | Descrizione 
    | ---------- | ------ | ----------------------------------- |
    | 2021/08/10 | Duel   | Prima versione                      |
*/

import styles from './MIPForms.module.scss'

import useTranslation from 'next-translate/useTranslation'

function togglePlay(src) {
    const player = document.getElementById('notiziario')
    if (player) {
        if (player.src === undefined) {
            console.log("Setting source to" + src)
            player.src = src;
        }
        if (player.paused || player.ended) {
            player.load()
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
        if (player.duration > 0) { 
            let pct= 1 - ((player.duration - player.currentTime) / player.duration)
            progress.value = pct
        } else {
            progress.value = 0;
        }
    }
}

/**
 * 
 * @param {*} props property dell'elemento
 * @param {string} audioUrl url dell'audio da utilizzare
 */
export default function MIPTrafficNewsPlayback(props) {
    const { t, lang } = useTranslation('common')
    return (
        <div className={styles.playback_container}>
        <button className={styles.traffic_news_btn} onClick={() => togglePlay(props.audioUrl)}>
            {t('Audio')}
        </button>
        <audio id="notiziario" 
            onTimeUpdate={() => displayProgress()}>No audio
            <source src="https://www.muoversinpiemonte.it/notiziario.mp3"></source>
            </audio>   
        <progress id="progress" className={`${styles.progress} mip-d-none`} />
        </div>
    )
}