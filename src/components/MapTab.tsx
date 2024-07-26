"use client";

import mapboxgl, { Map } from "mapbox-gl";
import { useEffect, useRef, useState } from "react";
// @ts-expect-error no types file
import MapboxDirections from "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions";

export const MapTab = () => {
  const [lat, setLat] = useState<number>(0);
  const [lng, setLng] = useState<number>(0);
  const watchID = useRef<number | null>(null);
  const directions = useRef<any>(null);
  const mapContainer = useRef<any>(null);
  const map = useRef<Map | null>(null);

  const getCurrentPositionCb: PositionCallback = (position) => {
    setLat(position.coords.latitude);
    setLng(position.coords.longitude);
  };

  useEffect(() => {
    map.current?.setCenter({ lat, lng });
    directions.current?.setOrigin([lng, lat]);
  }, [lat, lng]);

  useEffect(() => {
    if (navigator.geolocation && !watchID.current) {
      watchID.current =
        navigator.geolocation.watchPosition(getCurrentPositionCb);
    }

    if (map.current) return;
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/standard",
      center: [0, 0],
      zoom: 14
    });

    directions.current = new MapboxDirections({
      accessToken: mapboxgl.accessToken
    });

    map.current.addControl(directions.current, "top-left");

    return () => {
      // Clean up watch method
      map.current?.remove();
      if (watchID.current) {
        navigator.geolocation.clearWatch(watchID.current);
      }
    };
  }, []);

  return <div id="map" ref={mapContainer} className="h-96 w-96" />;
};
