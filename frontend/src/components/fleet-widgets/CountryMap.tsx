import { VectorMap } from "@react-jvectormap/core";
import { worldMill } from "@react-jvectormap/world";
import { Device } from "../../types/device";

interface CountryMapProps {
  devices: Device[];
  mapColor?: string;
}

const CountryMap: React.FC<CountryMapProps> = ({ devices, mapColor }) => {
  // Convert devices → vector map markers
  const markers = devices
    .filter(d => d.Latitude && d.Longitude)
    .map(d => ({
      latLng: [d.Latitude!, d.Longitude!] as [number, number],
      name: d.VehicleNumber || d.DeviceID,
      style: {
        fill: d.Online ? "#22c55e" : "#ef4444", // green / red
        borderWidth: 1,
        borderColor: "#ffffff",
      },
    }));

  return (
    <VectorMap
      map={worldMill}
      backgroundColor="transparent"

      markers={markers}
      markersSelectable={true}

      markerStyle={{
        initial: {
          r: 4,
        } as any,
        hover: {
          r: 6,
        } as any,
      }}

      zoomOnScroll={false}
      zoomMax={12}
      zoomMin={1}
      zoomAnimate={true}
      zoomStep={1.5}

      regionStyle={{
        initial: {
          fill: mapColor || "#D0D5DD",
          fillOpacity: 1,
          stroke: "none",
        },
        hover: {
          fill: "#465fff",
          fillOpacity: 0.7,
          cursor: "pointer",
        },
        selected: {
          fill: "#465FFF",
        },
      }}

      regionLabelStyle={{
        initial: {
          fill: "#35373e",
          fontSize: "13px",
          fontWeight: 500,
        },
      }}
    />
  );
};

export default CountryMap;
