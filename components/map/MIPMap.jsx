import { MapContainer, Marker, Popup, TileLayer, Icon } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
//import TrafficEventCard from './TrafficEventCard';

export default function Map(props) {
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
      iconUrl: '/map-icons/accident.svg',
      iconSize: [38, 95],
      iconAnchor: [22, 94],
      popupAnchor: [-3, -76],
      shadowUrl: null,
      shadowSize: [68, 95],
      shadowAnchor: [22, 94]
  });
  return (
    <MapContainer center={[45.052237, 7.515388]} zoom={8} scrollWheelZoom={false} 
    style={{width: "100%", height: "100%"}}
    >
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}map.5t.torino.it/light-new/{z}/{x}/{y}"
      />
      {
        props.trafficEvents && props.trafficEvents.map(evt => 
          <Marker key={evt.id} position={[evt.lat, evt.lng]} icon={icon}>
          {/* <Popup>
            <TrafficEventCard event={evt} />
          </Popup> */}
        </Marker>
        )
      }
    </MapContainer>
  )
}
