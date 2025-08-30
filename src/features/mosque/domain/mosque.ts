import { Entity } from "@/src/shared/core/entity";

export interface Shift {
    dayOfWeek: number;      // 0-6 (Sun-Sat)
    openTime: string;       // "11:00"
    closeTime: string;      // "23:00"
}

export interface Location {
    latitude: number;
    longitude: number;
    altitude: number;
    address: string;
}

export interface Convenience {
    fridayPrayerHours: string;
}

interface State {
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

interface Snapshot {
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

export class Mosque extends Entity<State, Snapshot> {
    constructor(params: State) {
        super();

        this._state = {
            id: params.id,
            name: params.name,
            location: params.location,
            phone: params.phone,
            email: params.email,
            website: params.website,
            description: params.description,
            photos: params.photos || [],
            conveniences: params.conveniences || {},
            openingHours: params.openingHours || []
        };
    }

    isOpen(datetime: Date): boolean {
        const dayOfWeek = datetime.getDay();
        const currentTime = datetime.toTimeString().slice(0, 5); // "HH:MM"

        const shift = this._state.openingHours.find(s => s.dayOfWeek === dayOfWeek);
        if (!shift) return false;

        return currentTime >= shift.openTime && currentTime <= shift.closeTime;
    }

    distanceFrom(location: {
        latitude: number;
        longitude: number;
    }): number {
        const R = 6371e3; // metres
        const φ1 = this._state.location.latitude * Math.PI / 180; // φ in radians
        const φ2 = location.latitude * Math.PI / 180; // φ in radians
        const Δφ = (location.latitude - this._state.location.latitude) * Math.PI / 180; // Δφ in radians
        const Δλ = (location.longitude - this._state.location.longitude) * Math.PI / 180; // Δλ in radians

        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c; // in metres
    }

    nextOpenDateTime(): Date | null {
        const now = new Date();
        const dayOfWeek = now.getDay();
        const currentTime = now.toTimeString().slice(0, 5); // "HH:MM"

        const shift = this._state.openingHours.find(s => s.dayOfWeek === dayOfWeek);
        if (!shift) return null;

        if (currentTime < shift.openTime) {
            const nextDay = dayOfWeek === 6 ? 0 : dayOfWeek + 1;
            const nextShift = this._state.openingHours.find(s => s.dayOfWeek === nextDay);
            if (!nextShift) return null;

            const nextOpenTime = new Date();
            nextOpenTime.setDate(now.getDate() + 1);
            nextOpenTime.setHours(Number(nextShift.openTime.split(':')[0]));
            nextOpenTime.setMinutes(Number(nextShift.openTime.split(':')[1]));
            return nextOpenTime;
        }

        return null;
    }

    nextCloseDateTime(): Date | null {
        const now = new Date();
        const dayOfWeek = now.getDay();
        const currentTime = now.toTimeString().slice(0, 5); // "HH:MM"

        const shift = this._state.openingHours.find(s => s.dayOfWeek === dayOfWeek);
        if (!shift) return null;

        if (currentTime > shift.closeTime) {
            const nextDay = dayOfWeek === 6 ? 0 : dayOfWeek + 1;
            const nextShift = this._state.openingHours.find(s => s.dayOfWeek === nextDay);
            if (!nextShift) return null;

            const nextCloseTime = new Date();
            nextCloseTime.setDate(now.getDate() + 1);
            nextCloseTime.setHours(Number(nextShift.closeTime.split(':')[0]));
            nextCloseTime.setMinutes(Number(nextShift.closeTime.split(':')[1]));
            return nextCloseTime;
        }

        return null;
    }

    snapshot(): Snapshot {
        return {
            id: this._state.id,
            name: this._state.name,
            location: this._state.location,
            phone: this._state.phone,
            email: this._state.email,
            website: this._state.website,
            description: this._state.description,
            photos: this._state.photos,
            conveniences: this._state.conveniences,
            openingHours: this._state.openingHours
        };
    }
}