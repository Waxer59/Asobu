"use client";

// @ts-ignore
import { createControlComponent } from "@react-leaflet/core";
import L from "leaflet";
import "leaflet-routing-machine";

interface Props {
  from: L.LatLng;
  to: L.LatLng;
}

const createRoutineMachineLayer = ({ from, to }: Props) => {
  // @ts-ignore
  const instance = L.Routing.control({
    waypoints: [from, to],
    lineOptions: {
      styles: [{ color: "#6FA1EC", weight: 4 }]
    },
    show: false,
    addWaypoints: false,
    routeWhileDragging: true,
    draggableWaypoints: true,
    showAlternatives: false
  });

  return instance;
};

const RoutingMachine = createControlComponent(createRoutineMachineLayer);

export default RoutingMachine;
