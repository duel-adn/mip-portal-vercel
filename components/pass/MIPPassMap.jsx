/**
    Duel S.p.A.

    Componente mappa basato su Leaflet

    Revision history

    | Data       | Autore | Descrizione 
    | ---------- | ------ | ----------------------------------- |
    | 2021/08/10 | Duel   | Prima versione                      |
*/

import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import MIPPass from './MIPPass';

export default function MIPPassMap({passData}) {
  const iconOpen =
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
        iconUrl: '/map-icons/pass-open.svg',
        iconSize: [38, 95],
        iconAnchor: [22, 94],
        popupAnchor: [-3, -76],
        shadowUrl: null,
        shadowSize: [68, 95],
        shadowAnchor: [22, 94]
    });
  const iconClosed =
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
          iconUrl: '/map-icons/pass-closed.svg',
          iconSize: [38, 95],
          iconAnchor: [22, 94],
          popupAnchor: [-3, -76],
          shadowUrl: null,
          shadowSize: [68, 95],
          shadowAnchor: [22, 94]
      });
        return (
    <MapContainer 
      center={[45.052237, 7.515388]} zoom={8} 
      scrollWheelZoom={true} 
      style={{flex: "1 1 100%"}}
      tap={false}
    >
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWlwNXQiLCJhIjoiY2t6M3cxdnNpMDN1eDJ2dXNuanh4c2c2biJ9.SE5K4iqgAcbFKHFSH0Q6tw"
      />
      {
        passData && passData.map(pass => 
          <Marker key={pass.name} 
            position={[pass.latitude, pass.longitude]} 
            icon={pass.state ? iconOpen : iconClosed}>
          <Popup>
            <MIPPass.Card passData={pass} />
          </Popup>
        </Marker>
        )
      }
    </MapContainer>
  )
}
