

export interface LocationRepository {
    getCurrentLocation(): Promise<{ latitude: number, longitude: number }>;
}