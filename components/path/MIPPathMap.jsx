/**
    Duel S.p.A.

    Componente mappa basato su Leaflet

    Revision history

    | Data       | Autore | Descrizione 
    | ---------- | ------ | ----------------------------------- |
    | 2021/08/10 | Duel   | Prima versione                      |
*/

import { MapContainer, Marker, Popup, TileLayer, WMSTileLayer, LayersControl } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { useIconMap } from '../../lib/MIPHooks'

function createIcon(path) {
  const icon =
    L.icon({
      //       iconUrl: '/traffic-icons/accident.svg',
      //       iconRetinaUrl: '/traffic-icons/accident.svg',
      //       iconAnchor: null,
      //       popupAnchor: null,
      //       shadowUrl: null,
      //       shadowSize: null,
      //       shadowAnchor: null,
      //       iconSize: new L.Point(60, 75),
      //       className: 'leaflet-div-icon'
      //   });
      //   var myIcon = L.icon({
      iconUrl: path,
      iconSize: [46, 47],
      iconAnchor: [23, 47],
      popupAnchor: [0, -47],
      shadowUrl: null,
      shadowSize: [68, 95],
      shadowAnchor: [22, 94]
    })
  return icon
}

export default function MIPPathMap(props) {
  const getMapIcon = useIconMap('/traffic-icons/pin', createIcon)
  return (
    <MapContainer
      tap={false}
      center={[45.052237, 7.515388]} zoom={9}
      scrollWheelZoom={false}
      style={{ flex: "1 1 100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}map.5t.torino.it/light-new/{z}/{x}/{y}"
      />
      <LayersControl position="topright">
        <LayersControl.Overlay name="traffico">
          <WMSTileLayer
            layers='optima:rlin_tre_fore0_cache'
            format='image/png'
            transparent={true}
            url="https://map.muoversinpiemonte.it/traffic-layer"
          />
        </LayersControl.Overlay>
      </LayersControl>
    </MapContainer>
  )
}
