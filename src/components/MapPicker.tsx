"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import { useEffect, useState } from "react";
import L from "leaflet";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

type Props = {
  lat?: number;
  lng?: number;
  onChange: (lat: number, lng: number) => void;
};

function LocationMarker({ onChange }: { onChange: Props["onChange"] }) {
  useMapEvents({
    click(e) {
      onChange(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 15);
  }, [center, map]);
  return null;
}

export default function MapPicker({ lat, lng, onChange }: Props) {
  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [center, setCenter] = useState<[number, number]>([
    lat ?? -6.2,
    lng ?? 106.816,
  ]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 🟢 SYNC EDIT MODE
  useEffect(() => {
    if (lat && lng) {
      setCenter([lat, lng]);
    }
  }, [lat, lng]);

  // 🔍 AUTOCOMPLETE
  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    const timeout = setTimeout(async () => {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=5&q=${encodeURIComponent(
          query
        )}`
      );
      const data = await res.json();
      setResults(data);
    }, 400);

    return () => clearTimeout(timeout);
  }, [query]);

  if (!mounted) return null;

  const selectLocation = (item: any) => {
    const lat = Number(item.lat);
    const lon = Number(item.lon);

    setCenter([lat, lon]);
    setQuery(item.display_name);
    setResults([]);
    onChange(lat, lon);
  };

  return (
    <div className="space-y-2 relative">
      {/* SEARCH */}
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Cari lokasi event"
        className="w-full border rounded px-3 py-2 text-sm"
      />

      {/* DROPDOWN */}
      {results.length > 0 && (
        <div className="absolute z-[9999] w-full bg-white border rounded shadow text-sm max-h-40 overflow-y-auto">
          {results.map((item) => (
            <button
              key={item.place_id}
              type="button"
              onClick={() => selectLocation(item)}
              className="w-full text-left px-3 py-2 hover:bg-gray-100"
            >
              {item.display_name}
            </button>
          ))}
        </div>
      )}

      {/* MAP */}
      <MapContainer
        center={center}
        zoom={13}
        style={{ height: 250, width: "100%", borderRadius: 8 }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ChangeView center={center} />
        <LocationMarker onChange={onChange} />
        {lat && lng && <Marker position={[lat, lng]} />}
      </MapContainer>
    </div>
  );
}
