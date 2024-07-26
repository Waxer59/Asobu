"use client";

import { MapContainer, TileLayer } from "react-leaflet";
import L from "leaflet";
import RoutingMachine from "@/components/RoutingMachine";
import "leaflet/dist/leaflet.css";
import "leaflet.awesome-markers/dist/leaflet.awesome-markers";
import "leaflet.awesome-markers/dist/leaflet.awesome-markers.css";
import { useEffect, useRef, useState } from "react";

interface CurrentPositionData {
  lat: number;
  lng: number;
}

// @ts-ignore
const DefaultIcon = L.AwesomeMarkers.icon({
  markerColor: "blue"
});

// Set default marker icon
L.Marker.prototype.options.icon = DefaultIcon;

const darkTile =
  "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
const lightTile =
  "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

export const Map = () => {
  const [currentPosition, setCurrentPosition] = useState<CurrentPositionData>();
  const watchID = useRef<number | null>(null);

  const getCurrentPositionCb: PositionCallback = (position) => {
    setCurrentPosition({
      lat: position.coords.latitude,
      lng: position.coords.longitude
    });
  };

  useEffect(() => {
    if (navigator.geolocation) {
      watchID.current =
        navigator.geolocation.watchPosition(getCurrentPositionCb);
    }

    return () => {
      // Clean up watch method
      if (watchID.current) {
        navigator.geolocation.clearWatch(watchID.current);
      }
    };
  }, []);

  return (
    currentPosition && (
      <MapContainer
        id="map"
        center={[51.505, -0.09]}
        zoom={13}
        className="w-96 h-96 rounded-sm"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url={darkTile}
        />
        <RoutingMachine
          from={L.latLng(currentPosition.lat, currentPosition.lng)}
          to={L.latLng(40.400082, -3.68286)}
        />
      </MapContainer>
    )
  );
};
