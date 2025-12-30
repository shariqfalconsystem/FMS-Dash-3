import {
  Truck,
  Activity,
  Power,
  MapPin,
} from "lucide-react";
import type { ComponentType } from "react";

export type IconComponent = ComponentType<{ className?: string }>;

export const iconMap = {
  totalVehicles: Truck,
  activeVehicles: Activity,
  ignitionOn: Power,
  geofenceAlerts: MapPin,
} as const;

export type IconKey = keyof typeof iconMap;
