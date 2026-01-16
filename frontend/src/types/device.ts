export interface Device {
  DeviceID: string;
  VehicleID?: string | null;
  VehicleNumber: string;

  DriverName?: string;
  DriverPhone?: string;

  Address?: string;
  Destination?: string;
  Location?: string;          // ✅ added
  ELockLocation?: string | null;

  Latitude?: number | null;
  Longitude?: number | null;

  Speed: number;
  Online: boolean;
  IgnitionOn: boolean;
  MainPowerConnected: boolean;

  Poi?: string | null;
  AlertCount: number;

  Unhealthy: boolean;
  NotWorking: boolean;

  maintenanceDue?: boolean;
  LastMovingTime?: string;
  IdleTime?: string; 

  LastContact?: string;  
  LastUpdate?: string;
}
