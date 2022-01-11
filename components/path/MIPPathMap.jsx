/**
    Duel S.p.A.

    Componente mappa basato su Leaflet

    Revision history

    | Data       | Autore | Descrizione 
    | ---------- | ------ | ----------------------------------- |
    | 2021/08/10 | Duel   | Prima versione                      |
*/

import 'leaflet/dist/leaflet.css'
import styles from "./MIPPlan.module.scss"

import { useContext, useEffect, useMemo, useRef, useState } from "react"

import { MapContainer, Marker, Popup, TileLayer, GeoJSON, WMSTileLayer, LayersControl, Polyline, useMapEvents } from 'react-leaflet'
import MIPPath from "./MIPPath"
import MIPPlan from './MIPPlan'
import { mipReverseGeocode } from '../../lib/MIPPlannerAPI'

const stopIcon = L.icon({
  iconUrl: '/path-icons/map-stop.svg',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
  popupAnchor: [0, -8],
})

const positionIcon = L.icon({
  iconUrl: '/path-icons/position.svg',
  iconSize: [30, 30],
  iconAnchor: [15, 15],
  popupAnchor: [0, -15],
})

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

function reverseGeocodeMarker(markerRef, setLocation) {
  if (markerRef.current) {
    markerRef.current.openPopup()
    const coords = markerRef.current.getLatLng()
    setLocation({
      name: null,
      coordinates: coords
    })
    reverseGeocode(markerRef.current.getLatLng(), (loc => {
      setLocation(loc)
    }))
  }
}

function reverseGeocode(position, setLocation) {
  if (position) {
    mipReverseGeocode('it', position.lng, position.lat)
      .then(pos => {
        const newLocation = pos.locations?.length ? pos.locations[0] : {
          name: "Località sconosciuta",
          coordinates: position
        }
        setLocation(newLocation)
      })
  }
}

function LocationPopup({ title, location, placeholder, children }) {
  return (
    <Popup minWidth={200}>
      <div className={styles.location_popup}>
        <div className={styles.title}>{title}</div>
        <div className={styles.name}>{location?.name ? location.name : placeholder}</div>
        <div className={styles.name}>{location?.locality ? location.locality : "\u00a0"}</div>
        {children}
      </div>
    </Popup>
  )
}

function PathEndpointLayer({ title, icon, location, setLocation, children }) {
  const markerRef = useRef()
  const eventHandlers = useMemo(
    () => ({
      dragend() { reverseGeocodeMarker(markerRef, setLocation) }
    })
  )
  return (
    <Marker ref={markerRef}
      position={location.coordinates} icon={icon}
      draggable={true} eventHandlers={eventHandlers} >
      <LocationPopup title={title} location={location}>
        {children}
      </LocationPopup>
    </Marker>
  )
}

function LocationMarker({ title, icon, setStartLocation, setEndLocation }) {
  const markerRef = useRef()
  const [position, setPosition] = useState(null)
  const [location, setLocation] = useState(null)
  useMapEvents({
    click(e) {
      setPosition(e.latlng)
    }
  })
  const eventHandlers = useMemo(
    () => ({
      dragend() { reverseGeocodeMarker(markerRef, setLocation) }
    })
  )
  useEffect(() => {
    reverseGeocodeMarker(markerRef, setLocation)
  }, [position])
  return (
    position ?
      <Marker ref={markerRef}
        position={position} icon={icon}
        draggable={true} eventHandlers={eventHandlers} >
        <LocationPopup title={title} location={location}>
          <div className={styles.button_bar}>
            <button type="button" onClick={() => {
              if (location && setStartLocation) { setStartLocation(location); setPosition(null) }
            }}>Partenza</button>
            <button type="button" onClick={() => {
              if (location && setEndLocation) { setEndLocation(location); setPosition(null) }
            }}>Destinazione</button>
          </div>
        </LocationPopup>
      </Marker>
      : null
  )
}

function PlanItineraryLayer({ itinerary, selected, color }) {
  return (
    itinerary?.legs && itinerary.legs.map(leg =>
      <Polyline key={leg.id} positions={leg.rawGeometry}
        pathOptions={
          {
            color: selected ? leg.routeColor ?? color : color,
            opacity: selected ? 1 : .9,
            weight: 6
          }
        }
      >
        <Popup>
          <MIPPlan.LegHeader leg={leg} />
        </Popup>
      </Polyline>
    )
  )
}

function LegStopsLayer({ leg }) {
  return leg.isTransit ?
    <>
      <StopMarker leg={leg} stop={leg.startLocation} />
      {leg?.intermediateStops?.map(stop =>
        <StopMarker key={stop.id} leg={leg} stop={stop} />
      )}
      <StopMarker leg={leg} stop={leg.endLocation} />
    </>
    : null
}

function StopMarker({ leg, stop }) {
  return (
    <Marker key={stop.id} position={stop.latLon} icon={stopIcon}>
      <Popup>
        <div className={styles.location_popup}>
          <div className={styles.title}>
            <span className={styles.plate} style={{
              color: leg.routeTextColor,
              backgroundColor: leg.routeColor,
              borderColor: leg.borderColor
            }}>{leg.transitRouteName}</span>
            {leg.agencyUrl ?
              <a href={leg.agencyUrl} target="_blank" rel="noopener noreferrer">
                {" " + leg.agencyName}
              </a>
              :
              <span>{leg.agencyName}</span>
            }
          </div>
          <div>{leg.headsign}</div>
          <div>{stop.name}</div>
        </div>
      </Popup>
    </Marker>
  )
}

export default function MIPPathMap() {
  const {
    plan, setMap,
    startLocation, setStartLocation,
    endLocation, setEndLocation, selectedItinerary
  } = useContext(MIPPath.Context)
  return (
    <MapContainer
      tap={false}
      center={[45.052237, 7.515388]} zoom={9}
      scrollWheelZoom={false}
      whenCreated={setMap}
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
      {selectedItinerary &&
        <>
          <PlanItineraryLayer key={selectedItinerary.id} selected color={selectedItinerary.color} itinerary={selectedItinerary} />
          {selectedItinerary?.legs?.map(leg =>
            <LegStopsLayer key={leg.id} leg={leg} />
          )}
        </>
      }
      {!selectedItinerary && plan?.plan?.itineraries && plan.plan.itineraries.map(it =>
        <PlanItineraryLayer key={it.id} itinerary={it}
          color={it.color} />
      )
      }
      {startLocation &&
        <PathEndpointLayer title="Partenza" location={startLocation} icon={departureIcon}
          setLocation={setStartLocation} />
      }
      {endLocation &&
        <PathEndpointLayer title="Arrivo" location={endLocation} icon={arrivalIcon}
          setLocation={setEndLocation} />
      }
      <LocationMarker title="Località" icon={positionIcon} setStartLocation={setStartLocation} setEndLocation={setEndLocation} open />
    </MapContainer>
  )
}
