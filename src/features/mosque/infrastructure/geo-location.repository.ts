import * as Location from 'expo-location';
import { LocationRepository } from "../domain/location.repository";


export class GeoLocationRepository implements LocationRepository {
    async getCurrentLocation(): Promise<{ latitude: number; longitude: number; }> {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            throw new Error('Permission to access location was denied');
        }

        let location = await Location.getCurrentPositionAsync({});

        return {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
        };
    }

}