import { useState, useCallback, useEffect } from 'react';
import { DetectedLocation } from '../types/location';
import { locationService } from '../services/locationService';

export function useLocation() {
  const [location, setLocation] = useState<DetectedLocation | null>(() => {
    return locationService.getStoredLocation();
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const saved = locationService.getStoredLocation();
    if (saved && !location) {
      setLocation(saved);
    }
  }, [location]);

  const requestBrowserLocation = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const coords = await locationService.requestCurrentPosition();
      const detected = await locationService.reverseGeocode(coords.latitude, coords.longitude);
      setLocation(detected);
      setIsLoading(false);
      return detected;
    } catch (err: any) {
      setIsLoading(false);
      const msg = err.message === 'PERMISSION_DENIED' ? 'PERMISSION_DENIED' : 'LOCATION_FAILED';
      setError(msg);
      throw err;
    }
  }, []);

  const setManualLocation = useCallback((stateName: string, districtName: string) => {
    const manualLoc = locationService.createManualLocation(stateName, districtName);
    setLocation(manualLoc);
    setError(null);
    return manualLoc;
  }, []);

  const clearLocation = useCallback(() => {
    locationService.clearStoredLocation();
    setLocation(null);
  }, []);

  return {
    location,
    isLoading,
    error,
    requestBrowserLocation,
    setManualLocation,
    clearLocation,
    getSuggestedLanguage: locationService.getSuggestedLanguage,
  };
}
