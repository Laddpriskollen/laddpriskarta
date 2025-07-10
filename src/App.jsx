import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import iconUrl from "/marker-icon.png";
import iconShadowUrl from "/marker-shadow.png";
import "./index.css";

const markerIcon = new L.Icon({
  iconUrl,
  shadowUrl: iconShadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function App() {
  const [stations, setStations] = useState([]);
  const [filterAC, setFilterAC] = useState(true);
  const [filterDC, setFilterDC] = useState(true);

  useEffect(() => {
    fetch("/mock-stations.json")
      .then((res) => res.json())
      .then((data) => setStations(data.stations));
  }, []);

  const filteredStations = stations.filter((s) => {
    if (!filterAC && s.type === "AC") return false;
    if (!filterDC && s.type === "DC") return false;
    return true;
  });

  return (
    <div style={{ backgroundColor: "#f2f2f2", height: "100vh" }}>
      <div className="grid grid-cols-1 md:grid-cols-3 h-screen">
        <div className="col-span-2 h-full">
          <div style={{ height: "100%", width: "100%" }}>
            <MapContainer
              center={[59.3293, 18.0686]}
              zoom={6}
              className="h-full w-full"
            >
              <TileLayer
                attribution='&copy; OpenStreetMap'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {filteredStations.map((station) => (
                <Marker
                  key={station.id}
                  position={[station.lat, station.lng]}
                  icon={markerIcon}
                >
                  <Popup>
                    <strong>{station.name}</strong>
                    <br />
                    Operatör: {station.operator}
                    <br />
                    Pris: {station.price ?? "Okänt"} kr/kWh
                    <br />
                    Typ: {station.type}
                    <br />
                    Effekt: {station.power} kW
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>
        <div className="p-4 overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">Laddstationer</h2>
          <div className="mb-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filterAC}
                onChange={() => setFilterAC(!filterAC)}
              />
              <span>Visa AC</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filterDC}
                onChange={() => setFilterDC(!filterDC)}
              />
              <span>Visa DC</span>
            </label>
          </div>
          {filteredStations.map((station) => (
            <div key={station.id} className="border p-2 mb-2 rounded">
              <p className="font-semibold">{station.name}</p>
              <p>Operatör: {station.operator}</p>
              <p>Pris: {station.price ?? "Okänt"} kr/kWh</p>
              <p>Typ: {station.type}</p>
              <p>Effekt: {station.power} kW</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
