import Link from 'next/link'
import styles from './MIPService.module.scss'

const provinces = [
    "Alessandria", 
    "Asti", "Biella", 
    "Cuneo", "Torino", 
    "Novara", "Vercelli", 
    "Verbano-Cusio-Ossola"
]

function getProvinces(array) {
    var numProvinces = Math.max(1,Math.floor(Math.random() * array.length))
    var text= ''
    var selected = new Set()
    for (var i = 0; i < numProvinces; ++i) {
        var provinceIdx = Math.floor(Math.random() * array.length);
        if (!selected.has(provinceIdx)) {
            selected.add(provinceIdx)
            var province = array[provinceIdx];

            text = i == 0 ? province : text + ', ' + province
        }
    }
    return text
}
export default function MIPRadioList(props) {
    const className = `${props.className || ''} ${styles.radio_list}`
    const radioList = props.radioList || []

    return (
        <div className={className}>
            {radioList.map(radio =>
                <div key={radio.name} className={styles.card}>
                    <h3 className={styles.title}>{radio.name}</h3>
                    <p className={styles.subtitle}>province servite</p>
                    <p className={styles.provinces}>{getProvinces(provinces)}</p>
                    <div className={styles.footer}>
                        <img className={styles.logo} src="/icons/broadcast-pin.svg" alt="broadcast" />
                        {radio.url &&
                            <Link href={radio.url} target="_blank" rel="noopener noreferrer"><a className={styles.link}>vai al sito</a></Link>
                        }
                    </div>
                </div>
            )}
        </div>
    )
}