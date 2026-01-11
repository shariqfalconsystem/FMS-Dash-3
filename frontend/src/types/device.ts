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


