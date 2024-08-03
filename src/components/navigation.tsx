'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl, { Map } from 'mapbox-gl';
// @ts-expect-error No types file
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';
import '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css';
import { Card, Button } from '@shadcn/index';
import Draggable from 'react-draggable';
import { BounceLoader } from 'react-spinners';
import { X } from 'lucide-react';

interface Props {
  from?: string;
  destination: string;
  onClose: () => void;
}

export const Navigation = ({ destination, from, onClose }: Props) => {
  const [lat, setLat] = useState<number>(0);
  const [lng, setLng] = useState<number>(0);
  const watchID = useRef<number | null>(null);
  const directions = useRef<any>(null);
  const mapContainer = useRef<any>(null);
  const map = useRef<Map | null>(null);
  const dragRef = useRef(null);
  const [isMapLoading, setIsMapLoading] = useState<boolean>(true);

  const getCurrentPositionCb: PositionCallback = (position) => {
    setLat(position.coords.latitude);
    setLng(position.coords.longitude);
  };

  useEffect(() => {
    if (from) return;

    map.current?.setCenter({ lat, lng });
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
      style: 'mapbox://styles/mapbox/standard',
      center: [0, 0],
      zoom: 14
    });

    directions.current = new MapboxDirections({
      accessToken: mapboxgl.accessToken,
      unit: 'metric',
      profile: 'mapbox/walking'
    });

    map.current.addControl(directions.current, 'top-left');

    const setRoute: PositionCallback = (position) => {
      const { latitude: lat, longitude: lng } = position.coords;
      map.current?.setCenter({ lat, lng });
      map.current?.on('load', () => {
        directions.current.setOrigin(from ?? [lng, lat]);
        directions.current.setDestination(destination);
        setIsMapLoading(false);
      });
    };

    navigator.geolocation.getCurrentPosition(setRoute);

    return () => {
      // Clean up
      map.current?.remove();
      if (watchID.current) {
        navigator.geolocation.clearWatch(watchID.current);
      }
    };
  }, []);

  return (
    <Draggable nodeRef={dragRef} bounds="parent" cancel="#map">
      <div ref={dragRef} className="absolute z-50 top-0">
        <Card className="cursor-move p-7 flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 w-5 h-5"
            onClick={onClose}>
            <X />
          </Button>
          {isMapLoading && (
            <div className="flex flex-col items-center justify-center gap-4 w-80 h-80">
              <BounceLoader color="#e2e2e2" />
              <span className="font-bold">Loading map...</span>
            </div>
          )}
          <div
            ref={mapContainer}
            id="map"
            className={`h-80 rounded-md flex ${isMapLoading ? 'hidden' : ''}`}></div>
        </Card>
      </div>
    </Draggable>
  );
};
