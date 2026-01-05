export interface Device {
  DeviceID: string;
  VehicleNumber?: string;
  Latitude: number | null;
  Longitude: number | null;
  Speed: number | null;
  Online: boolean;
  LastContact: string | null;
  maintenanceDue?: boolean;
  Address?: string;
  Location?: string;
  
}

