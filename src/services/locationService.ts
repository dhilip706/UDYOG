import { DetectedLocation, StateInfo } from '../types/location';
import { SupportedLanguageCode } from '../types/language';

export const INDIAN_STATES: StateInfo[] = [
  {
    name: 'Tamil Nadu',
    code: 'TN',
    defaultLanguageCode: 'ta',
    districts: [
      'Thanjavur', 'Chennai', 'Salem', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Tirunelveli',
      'Erode', 'Vellore', 'Dindigul', 'Kanchipuram', 'Cuddalore',
      'Tiruppur', 'Thoothukudi', 'Nagercoil', 'Karur', 'Namakkal', 'Hosur'
    ]
  },
  {
    name: 'Karnataka',
    code: 'KA',
    defaultLanguageCode: 'kn',
    districts: [
      'Bengaluru Urban', 'Mysuru', 'Mangaluru', 'Hubballi-Dharwad', 'Belagavi',
      'Kalaburagi', 'Ballari', 'Shivamogga', 'Tumakuru', 'Udupi', 'Davanagere'
    ]
  },
  {
    name: 'Kerala',
    code: 'KL',
    defaultLanguageCode: 'ml',
    districts: [
      'Thiruvananthapuram', 'Kochi / Ernakulam', 'Kozhikode', 'Kollam', 'Thrissur',
      'Kannur', 'Alappuzha', 'Kottayam', 'Palakkad', 'Malappuram'
    ]
  },
  {
    name: 'Andhra Pradesh',
    code: 'AP',
    defaultLanguageCode: 'te',
    districts: [
      'Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Kurnool',
      'Rajahmundry', 'Tirupati', 'Kakinada', 'Kadapa', 'Anantapur'
    ]
  },
  {
    name: 'Telangana',
    code: 'TG',
    defaultLanguageCode: 'te',
    districts: [
      'Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar', 'Khammam',
      'Ramagundam', 'Mahbubnagar', 'Nalgonda', 'Adilabad'
    ]
  },
  {
    name: 'Maharashtra',
    code: 'MH',
    defaultLanguageCode: 'mr',
    districts: [
      'Mumbai', 'Pune', 'Nagpur', 'Thane', 'Nashik', 'Chhatrapati Sambhajinagar',
      'Solapur', 'Kolhapur', 'Navi Mumbai', 'Amravati'
    ]
  },
  {
    name: 'Delhi NCR',
    code: 'DL',
    defaultLanguageCode: 'hi',
    districts: [
      'New Delhi', 'Central Delhi', 'South Delhi', 'North Delhi', 'West Delhi', 'East Delhi'
    ]
  },
  {
    name: 'Uttar Pradesh',
    code: 'UP',
    defaultLanguageCode: 'hi',
    districts: [
      'Lucknow', 'Kanpur', 'Varanasi', 'Agra', 'Prayagraj', 'Noida', 'Ghaziabad', 'Meerut', 'Gorakhpur'
    ]
  },
  {
    name: 'Rajasthan',
    code: 'RJ',
    defaultLanguageCode: 'hi',
    districts: [
      'Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Bikaner', 'Ajmer', 'Alwar'
    ]
  },
  {
    name: 'West Bengal',
    code: 'WB',
    defaultLanguageCode: 'en',
    districts: [
      'Kolkata', 'Howrah', 'Durgapur', 'Asansol', 'Siliguri', 'Bardhaman'
    ]
  },
  {
    name: 'Gujarat',
    code: 'GJ',
    defaultLanguageCode: 'hi',
    districts: [
      'Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar', 'Gandhinagar'
    ]
  },
  {
    name: 'Madhya Pradesh',
    code: 'MP',
    defaultLanguageCode: 'hi',
    districts: [
      'Bhopal', 'Indore', 'Jabalpur', 'Gwalior', 'Ujjain', 'Sagar'
    ]
  },
  {
    name: 'Punjab',
    code: 'PB',
    defaultLanguageCode: 'hi',
    districts: [
      'Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda', 'Mohali'
    ]
  },
  {
    name: 'Haryana',
    code: 'HR',
    defaultLanguageCode: 'hi',
    districts: [
      'Gurugram', 'Faridabad', 'Panipat', 'Ambala', 'Hisar', 'Karnal', 'Rohtak'
    ]
  },
  {
    name: 'Bihar',
    code: 'BR',
    defaultLanguageCode: 'hi',
    districts: [
      'Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Purnia', 'Darbhanga'
    ]
  }
];

const STORAGE_KEY = 'aura_user_location';

export const locationService = {
  getStoredLocation(): DetectedLocation | null {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  saveStoredLocation(location: DetectedLocation): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(location));
    } catch (e) {
      console.warn('Unable to persist location:', e);
    }
  },

  clearStoredLocation(): void {
    localStorage.removeItem(STORAGE_KEY);
  },

  getSuggestedLanguage(stateName: string): SupportedLanguageCode {
    if (!stateName) return 'en';
    const cleanState = stateName.toLowerCase();

    if (cleanState.includes('tamil')) return 'ta';
    if (cleanState.includes('kerala')) return 'ml';
    if (cleanState.includes('karnataka')) return 'kn';
    if (cleanState.includes('andhra') || cleanState.includes('telangana')) return 'te';
    if (cleanState.includes('maharashtra')) return 'mr';
    if (cleanState.includes('bengal')) return 'bn';
    if (
      cleanState.includes('delhi') ||
      cleanState.includes('uttar pradesh') ||
      cleanState.includes('madhya pradesh') ||
      cleanState.includes('rajasthan') ||
      cleanState.includes('bihar') ||
      cleanState.includes('haryana') ||
      cleanState.includes('punjab') ||
      cleanState.includes('gujarat')
    ) {
      return 'hi';
    }

    const matched = INDIAN_STATES.find(s => cleanState.includes(s.name.toLowerCase()));
    if (matched && matched.defaultLanguageCode) {
      return matched.defaultLanguageCode as SupportedLanguageCode;
    }

    return 'en';
  },

  async requestCurrentPosition(): Promise<{ latitude: number; longitude: number; accuracy: number }> {
    return new Promise((resolve, reject) => {
      if (!('geolocation' in navigator)) {
        reject(new Error('Geolocation is not supported by your browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          });
        },
        (error) => {
          let message = 'Unable to retrieve location';
          if (error.code === error.PERMISSION_DENIED) {
            message = 'PERMISSION_DENIED';
          } else if (error.code === error.POSITION_UNAVAILABLE) {
            message = 'Location information is unavailable';
          } else if (error.code === error.TIMEOUT) {
            message = 'The request to get user location timed out';
          }
          reject(new Error(message));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        }
      );
    });
  },

  async reverseGeocode(latitude: number, longitude: number): Promise<DetectedLocation> {
    // Tier 1: OpenStreetMap Nominatim
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`;
      const response = await fetch(url, {
        headers: { 'Accept-Language': 'en' },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        const address = data.address || {};
        const state = address.state || address.region || '';
        const district =
          address.state_district ||
          address.county ||
          address.city ||
          address.town ||
          address.village ||
          address.suburb ||
          '';
        const country = address.country || 'India';

        if (state) {
          const formattedAddress = district ? `${district}, ${state}` : `${state}, ${country}`;
          const loc: DetectedLocation = {
            district: district || undefined,
            state,
            country,
            formattedAddress,
            isManual: false,
            coordinates: { latitude, longitude },
            timestamp: Date.now(),
          };
          this.saveStoredLocation(loc);
          return loc;
        }
      }
    } catch {
      // Nominatim unreachable or timed out
    }

    // Tier 2: BigDataCloud Reverse Geocoding Client
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const bdcUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;
      const response = await fetch(bdcUrl, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        const state = data.principalSubdivision || '';
        const district = data.locality || data.city || '';
        const country = data.countryName || 'India';

        if (state) {
          const formattedAddress = district ? `${district}, ${state}` : `${state}, ${country}`;
          const loc: DetectedLocation = {
            district: district || undefined,
            state,
            country,
            formattedAddress,
            isManual: false,
            coordinates: { latitude, longitude },
            timestamp: Date.now(),
          };
          this.saveStoredLocation(loc);
          return loc;
        }
      }
    } catch {
      // BigDataCloud unreachable
    }

    // Tier 3: Approximate by Indian Coordinate Boundaries
    let state = 'India';
    let district: string | undefined;

    // Southern India coordinates
    if (latitude >= 8.0 && latitude <= 13.5 && longitude >= 76.0 && longitude <= 80.5) {
      state = 'Tamil Nadu';
    } else if (latitude >= 8.0 && latitude <= 12.8 && longitude >= 74.8 && longitude <= 77.5) {
      state = 'Kerala';
    } else if (latitude >= 11.5 && latitude <= 18.5 && longitude >= 74.0 && longitude <= 78.6) {
      state = 'Karnataka';
    } else if (latitude >= 12.5 && latitude <= 19.9 && longitude >= 76.7 && longitude <= 84.7) {
      state = 'Andhra Pradesh';
    } else if (latitude >= 15.6 && latitude <= 22.0 && longitude >= 72.6 && longitude <= 80.9) {
      state = 'Maharashtra';
    } else if (latitude >= 28.0 && latitude <= 29.0 && longitude >= 76.8 && longitude <= 77.5) {
      state = 'Delhi NCR';
    }

    const formattedAddress = `${state}, India`;
    const fallbackLocation: DetectedLocation = {
      district,
      state,
      country: 'India',
      formattedAddress,
      isManual: false,
      coordinates: { latitude, longitude },
      timestamp: Date.now(),
    };
    this.saveStoredLocation(fallbackLocation);
    return fallbackLocation;
  },

  createManualLocation(stateName: string, districtName: string): DetectedLocation {
    const location: DetectedLocation = {
      district: districtName,
      state: stateName,
      country: 'India',
      formattedAddress: `${districtName}, ${stateName}`,
      isManual: true,
      timestamp: Date.now(),
    };
    this.saveStoredLocation(location);
    return location;
  },
};
