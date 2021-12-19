/**
    Duel S.p.A.

    Componente mappa basato su Leaflet

    Revision history

    | Data       | Autore | Descrizione 
    | ---------- | ------ | ----------------------------------- |
    | 2021/08/10 | Duel   | Prima versione                      |
*/

import styles from "./MIPPlan.module.scss"

import { MapContainer, Marker, Popup, TileLayer, GeoJSON, WMSTileLayer, LayersControl } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { useIconMap } from '../../lib/MIPHooks'
import MIPPlan from './MIPPlan'

const departureIcon = L.icon({
  iconUrl: '/path-icons/map-departure.svg',
  iconSize: [24, 24],
  iconAnchor: [0, 24],
  popupAnchor: [12, -30],
})

const arrivalIcon = L.icon({
  iconUrl: '/path-icons/map-arrival.svg',
  iconSize: [24, 24],
  iconAnchor: [12, 24],
  popupAnchor: [0, -30],
})


function LegPopup({ leg }) {

}

function LocationLayer({ label, name, coords, icon }) {
  return (
    <Marker position={coords} icon={icon}>
      <Popup>
        <div className={styles.location_popup}>
          <div className={styles.title}>{label}</div>
          <div className={styles.name}>{name}</div>
        </div>
      </Popup>
    </Marker>
  )
}
function PlanItineraryLayer({ itinerary }) {
  return (
    itinerary?.legs && itinerary.legs.map(leg =>
        <GeoJSON key={leg.id} data={leg.geometry}
          style={{
            color: leg.description?.route?.borderColor ?? 'rgb(46, 97, 167)',
            weight: 6,
          }}>
          <Popup>
            <MIPPlan.LegHeader leg={leg} />
          </Popup>
        </GeoJSON>
    )
  )
}

export default function MIPPathMap({ plan, activeId }) {
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
      {plan?.itineraries && plan.itineraries.map(it =>
        <PlanItineraryLayer key={it.id} itinerary={it} />
      )}
      {plan?.description?.fromCoords &&
        <LocationLayer label="Partenza" name={plan.description?.fromName} coords={plan.description.fromCoords} icon={departureIcon} />
      }
      {plan?.description?.toCoords &&
        <LocationLayer label="Arrivo" name={plan.description?.toName} coords={plan.description.toCoords} icon={arrivalIcon} />
      }
    </MapContainer>
  )
}
