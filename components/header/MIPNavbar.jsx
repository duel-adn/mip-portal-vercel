import Link from 'next/link'
import styles from './MIPHeader.module.scss'

// TODO: Move outside
const navbarData = [
    { title: 'Home', url: '/'},
    { title: 'Traffico', url: '/traffic'},
    { title: 'Trasporto pubblico', url: '/tpl' },
    { title: 'Mobilità alternativa', url: '/mobility' },
    { title: 'Il servizio', url: '#' },
    { title: 'Contatti', url: '#' },
]

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
    // const button = document.getElementById('playbtn')
    // const player = document.getElementById('notiziario')
    // let pct= ((player.duration - player.currentTime) / player.duration) * 100
    // console.log(pct)
    // button.style.backgroundImage = `linear-gradient(90deg, red ${pct}%, blue ${(1-pct)}%)`
}

// TODO: link notiziario nella configurazione 

export default function MIPNavbar(props) {
    return (
        <nav className={`${props.className} ${styles.navbar}`}>
            <Link href="/"><img src='/images/logo.svg' alt='Muoversi in piemonte' /></Link>
            <ul>
                {
                    navbarData.map(entry => 
                    <li key={entry.title}><a href={entry.url}>{entry.title}</a></li>
                    )
                }
            </ul>
            <div>
            <button id="playbtn" onClick={() => togglePlay()} className="bg-magenta">Ascolta il notiziario</button>
            <audio id="notiziario" src="https://www.muoversinpiemonte.it/notiziario/notiziario.mp3"
                onTimeUpdate={() => displayProgress()}>No audio</audio>
            <input type="text" placeholder="Cerca sul sito" />
            </div>
        </nav>
    )
}