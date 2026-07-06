"use client";

import { useEffect, useState, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Define icons using CDN assets to avoid bundler loading issues
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const RescueIcon = L.icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const FuzzedIcon = L.icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const ClinicIcon = L.icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const RecommendedClinicIcon = L.icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

export interface MapMarker {
  lat: number;
  lng: number;
  title?: string;
  iconType?: "rescue" | "fuzzed" | "clinic" | "recommended-clinic";
}

interface LeafletMapProps {
  mode: "picker" | "display";
  center: [number, number];
  zoom?: number;
  markers?: MapMarker[];
  onLocationChange?: (lat: number, lng: number) => void;
}

// Helper component to center map on center prop changes
function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [center, map]);
  return null;
}

// Helper component to handle map clicks for picker mode
function MapClickEvents({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

// Fit bounds if we have multiple markers in display mode
function FitBounds({ markers }: { markers: MapMarker[] }) {
  const map = useMap();
  useEffect(() => {
    if (markers.length > 1) {
      const bounds = L.latLngBounds(markers.map((m) => [m.lat, m.lng]));
      map.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [markers, map]);
  return null;
}

export default function LeafletMap({
  mode,
  center,
  zoom = 13,
  markers = [],
  onLocationChange,
}: LeafletMapProps) {
  const [pickerPosition, setPickerPosition] = useState<[number, number]>(center);

  // Sync state if center prop updates
  useEffect(() => {
    if (mode === "picker") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPickerPosition(center);
    }
  }, [center, mode]);

  const handleMapClick = (lat: number, lng: number) => {
    if (mode !== "picker") return;
    setPickerPosition([lat, lng]);
    if (onLocationChange) onLocationChange(lat, lng);
  };

  const getIcon = (type?: string) => {
    switch (type) {
      case "rescue":
        return RescueIcon;
      case "fuzzed":
        return FuzzedIcon;
      case "clinic":
        return ClinicIcon;
      case "recommended-clinic":
        return RecommendedClinicIcon;
      default:
        return DefaultIcon;
    }
  };

  const eventHandlers = useMemo(
    () => ({
      dragend(e: L.LeafletEvent) {
        const marker = e.target;
        const pos = marker.getLatLng();
        setPickerPosition([pos.lat, pos.lng]);
        if (onLocationChange) onLocationChange(pos.lat, pos.lng);
      },
    }),
    [onLocationChange]
  );

  return (
    <div className="h-full w-full relative z-0">
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <ChangeView center={mode === "picker" ? pickerPosition : center} />
        
        {mode === "display" && <FitBounds markers={markers} />}

        {mode === "display" && markers.length > 1 && (
          <Polyline
            positions={[
              [markers[0].lat, markers[0].lng],
              [markers[1].lat, markers[1].lng],
            ]}
            color="#6C5CE7"
            weight={4}
            opacity={0.8}
            dashArray="10, 10"
          />
        )}

        {mode === "picker" ? (
          <>
            <MapClickEvents onMapClick={handleMapClick} />
            <Marker
              position={pickerPosition}
              draggable={true}
              icon={RescueIcon}
              eventHandlers={eventHandlers}
            >
              <Popup>Drag me or click map to adjust the rescue location.</Popup>
            </Marker>
          </>
        ) : (
          markers.map((m, idx) => (
            <Marker key={idx} position={[m.lat, m.lng]} icon={getIcon(m.iconType)}>
              {m.title && <Popup>{m.title}</Popup>}
            </Marker>
          ))
        )}
      </MapContainer>
    </div>
  );
}
