/**
    Duel S.p.A.

    Componente mappa basato su Leaflet

    Revision history

    | Data       | Autore | Descrizione 
    | ---------- | ------ | ----------------------------------- |
    | 2021/08/10 | Duel   | Prima versione                      |
*/

import 'leaflet/dist/leaflet.css'
import { useMemo } from 'react'
import { useRef } from 'react'
import { useEffect } from 'react'
import { useContext } from 'react'
import { MapContainer, Marker, Popup, TileLayer, WMSTileLayer } from 'react-leaflet'
import { useIconMap } from '../../lib/MIPHooks'
import MIPTraffic from './MIPTraffic'

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
      //   })
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

export default function MIPTrafficMap() {
  const getMapIcon = useIconMap('/traffic-icons/pin', createIcon)
  const { setMap, selectedEventInfo, trafficEventData, selectEvent,
    eventPopupRef } = useContext(MIPTraffic.Context)
  return (
    <MapContainer
      tap={false}
      center={[45.052237, 7.515388]} zoom={9}
      scrollWheelZoom={true}
      style={{ flex: "1 1 100%" }}
      whenCreated={setMap}
    >
      <TileLayer
        attribution='&copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}map.5t.torino.it/light-new/{z}/{x}/{y}"
      />
      {
        trafficEventData && trafficEventData.map(evt =>
          <Marker key={evt.id} position={[evt.lat, evt.lng]}
            icon={getMapIcon(evt.style, evt.id === selectedEventInfo?.event?.id)}
            zIndexOffset={evt.id == selectedEventInfo?.event?.id ? 100 : 0}
            eventHandlers={{
              'click': () => selectEvent(evt, true)
            }}>
            {evt.id === selectedEventInfo?.event?.id ? 
            <Popup ref={eventPopupRef}>
              <MIPTraffic.EventCard event={evt} />
            </Popup>
            : null}
          </Marker>
        )
      }
      <WMSTileLayer
        layers='optima:rlin_tre_fore0_cache'
        format='image/png'
        transparent={true}
        url="https://map.muoversinpiemonte.it/traffic-layer"
      />
    </MapContainer>
  )
}
