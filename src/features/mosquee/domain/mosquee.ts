export interface Shift {
  dayOfWeek: number;      // 0-6 (Sun-Sat)
  openTime: string;       // "11:00"
  closeTime: string;      // "23:00"
}

interface Location {
    latitude: number;
    longitude: number;
    altitude: number;
    address: string;
}

interface Convenience {
    fridayPrayerHours: string;
}

export interface Mosquee {
    id: string;
    name: string;
    location: Location;
    phone: string;
    email?: string;
    website?: string;
    description?: string;
    photos?: string[];
    conveniences?: Partial<Convenience>;
    openingHours: Shift[];
}