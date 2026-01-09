// export interface Device {
//   DeviceID: string;
//   VehicleNumber?: string;
//   Latitude: number | null;
//   Longitude: number | null;
//   Speed: number | null;
//   Online: boolean;
//   LastContact: string | null;
//   maintenanceDue?: boolean;
//   Address?: string;
//   Location?: string;
//   DriverName?: string;
//   DriverContact?: string;
//   DriverPhone?: string;
//   IgnitionStatus?: boolean;
//   ELockLocation?: string;
//   MainPowerConnected?: boolean;
//   IgnitionOn?: boolean;
//   vehReg?: string;
//   lat?: number;
//   lng?: number;
//   addr?: string;
//   speed?: number;
// }
/* ---------- API TYPES ---------- */

interface ApiDriver {
  driverName?: string;
  phoneNumber?: string;
}

interface ApiLatLngDtl {
  lat?: number;
  lng?: number;
  addr?: string;
}

interface ApiGpsDtl {
  latLngDtl?: ApiLatLngDtl;
  speed?: number;
}

interface ApiStatus {
  isOnline?: boolean;
  ignitionOn?: boolean;
  mainPowerConnected?: boolean;
}

interface ApiMaintenance {
  isDue?: boolean;
}

export default interface ApiDevice {
  vehReg?: string;
  drivers?: ApiDriver;
  gpsDtl?: ApiGpsDtl;
  status?: ApiStatus;
  maintenance?: ApiMaintenance;
}


