"use client"
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

const locations = [
  { name: "Masjid al-Haram (Makkah)", coords: [21.4225, 39.8262], description: "Kaaba, Tawaf area" },
  { name: "Masjid an-Nabawi (Madinah)", coords: [24.4686, 39.6142], description: "Prophet's Mosque" },
  { name: "Mina", coords: [21.4133, 39.8933], description: "Tent city, Stoning of Jamarat" },
  { name: "Arafat", coords: [21.3549, 39.9832], description: "Day of Arafat" },
  { name: "Muzdalifah", coords: [21.3956, 39.9341], description: "Night stay, pebble collection" },
]

export default function Map() {
  return (
    <MapContainer center={[21.4225, 39.8262]} zoom={10} style={{ height: "400px", width: "100%", borderRadius: "1rem" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {locations.map((loc, idx) => (
        <Marker key={idx} position={loc.coords as [number, number]}>
          <Popup><b>{loc.name}</b><br />{loc.description}</Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
