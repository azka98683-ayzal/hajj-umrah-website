'use client';

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Leaflet markers ke liye default icon fix (TypeScript safe)
// @ts-ignore - to bypass TypeScript issue with _getIconUrl
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const KAABA_COORDS: [number, number] = [21.4225, 39.8262];

// Qibla direction calculate karne ka formula (Haversine based bearing)
function calculateQibla(lat: number, lng: number): number {
  const lat1 = (lat * Math.PI) / 180;
  const lon1 = (lng * Math.PI) / 180;
  const lat2 = (KAABA_COORDS[0] * Math.PI) / 180;
  const lon2 = (KAABA_COORDS[1] * Math.PI) / 180;
  const dLon = lon2 - lon1;
  const y = Math.sin(dLon) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
  let bearing = (Math.atan2(y, x) * 180) / Math.PI;
  bearing = (bearing + 360) % 360;
  return bearing;
}

export default function MapAndQibla() {
  const [userCoords, setUserCoords] = useState<[number, number] | null>(null);
  const [qiblaBearing, setQiblaBearing] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
          setUserCoords(coords);
          const bearing = calculateQibla(coords[0], coords[1]);
          setQiblaBearing(bearing);
          setLoading(false);
        },
        () => {
          // Agar location nahi milti toh default Makkah dikhao
          setUserCoords(KAABA_COORDS);
          setQiblaBearing(0);
          setLoading(false);
          setError(true);
        }
      );
    } else {
      setUserCoords(KAABA_COORDS);
      setQiblaBearing(0);
      setLoading(false);
      setError(true);
    }
  }, []);

  if (loading) {
    return <div className="text-center text-slate-400 py-10">Loading Map & Qibla...</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-black text-white">Map & Qibla Direction</h2>
      {error && (
        <div className="bg-amber-500/10 border border-amber-500/30 text-amber-400 p-3 rounded-xl text-xs">
          Location access denied. Showing default Makkah view.
        </div>
      )}
      <div className="grid md:grid-cols-3 gap-4">
        {/* Map Container */}
        <div className="md:col-span-2 h-[450px] rounded-2xl overflow-hidden border border-white/10 bg-neutral-900">
          <MapContainer center={userCoords || KAABA_COORDS} zoom={13} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {userCoords && (
              <Marker position={userCoords}>
                <Popup>Your Location</Popup>
              </Marker>
            )}
            <Marker position={KAABA_COORDS}>
              <Popup>Kaaba (Makkah)</Popup>
            </Marker>
            {userCoords && (
              <Polyline positions={[userCoords, KAABA_COORDS]} color="#f59e0b" weight={3} dashArray="5, 5" />
            )}
          </MapContainer>
        </div>

        {/* Qibla Compass */}
        <div className="bg-neutral-900/80 rounded-2xl p-6 border border-white/5 flex flex-col items-center justify-center">
          <div className="text-center">
            <h3 className="text-amber-400 font-bold uppercase text-sm">Qibla Direction</h3>
            <div className="relative w-32 h-32 mx-auto mt-4">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                {/* Background Circle */}
                <circle cx="50" cy="50" r="45" fill="#1e293b" stroke="#475569" strokeWidth="2" />
                {/* North Arrow (Static) */}
                <line x1="50" y1="50" x2="50" y2="5" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" />
                <polygon points="50,5 45,15 55,15" fill="#f59e0b" />
                <circle cx="50" cy="50" r="5" fill="#f59e0b" />
                {/* Labels */}
                <text x="50" y="97" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="sans-serif">N</text>
                <text x="97" y="53" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="sans-serif">E</text>
                <text x="50" y="5" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="sans-serif">S</text>
                <text x="3" y="53" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="sans-serif">W</text>

                {/* Qibla Red Line - Rotates dynamically */}
                {qiblaBearing !== null && (
                  <line
                    x1="50"
                    y1="50"
                    x2={50 + 40 * Math.sin((qiblaBearing * Math.PI) / 180)}
                    y2={50 - 40 * Math.cos((qiblaBearing * Math.PI) / 180)}
                    stroke="#ef4444"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                )}
              </svg>
            </div>
            <p className="text-xs text-slate-400 mt-3">
              Bearing: <span className="text-white font-bold">{Math.round(qiblaBearing || 0)}°</span>
              <br />
              <span className="text-emerald-400 text-[10px]">Red line = Qibla direction</span>
            </p>
            <p className="text-[10px] text-slate-500 mt-1">* Rotate device to align N (North)</p>
          </div>
        </div>
      </div>
    </div>
  );
}