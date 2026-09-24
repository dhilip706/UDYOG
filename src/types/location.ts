export interface GeoCoordinates {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export interface DetectedLocation {
  district?: string;
  city?: string;
  state: string;
  stateCode?: string;
  country: string;
  formattedAddress: string;
  isManual: boolean;
  coordinates?: GeoCoordinates;
  timestamp: number;
}

export interface StateInfo {
  name: string;
  code: string;
  defaultLanguageCode: string;
  districts: string[];
}
