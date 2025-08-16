import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { Linking, Platform, Share } from 'react-native';

export function useGeolocation() {
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    useEffect(() => {
        async function getCurrentLocation() {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
        }

        getCurrentLocation();
    }, []);

    const formatDistance = (distance: number) => {
        if (distance < 1000) {
            return `${Math.round(distance)} m`;
        } else {
            return `${(distance / 1000).toFixed(1)} km`;
        }
    }

    // Function to calculate the distance between two locations in meters
    const getDistance = (
        locationA: { latitude: number; longitude: number },
        locationB: { latitude: number; longitude: number }
    ): number => {
        const toRad = (value: number) => (value * Math.PI) / 180;

        const R = 6371; // Radius of the Earth in kilometers
        const dLat = toRad(locationB.latitude - locationA.latitude);
        const dLon = toRad(locationB.longitude - locationA.longitude);

        const lat1 = toRad(locationA.latitude);
        const lat2 = toRad(locationB.latitude);

        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1) * Math.cos(lat2) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        const distance = R * c;

        return distance * 1000;
    };

    async function openRoute(params: {
        lat: number;
        lng: number;
    }) {
        let url = "";

        const origin = {
            lat: location?.coords.latitude,
            lng: location?.coords.longitude,
        };
        const destination = {
            lat: params.lat,
            lng: params.lng,
        };

        if (Platform.OS === "ios") {
            // Apple Maps
            url = `http://maps.apple.com/?saddr=${origin.lat},${origin.lng}&daddr=${destination.lat},${destination.lng}`;
        } else if (Platform.OS === "android") {
            // Google Maps (preferred on Android)
            url = `https://www.google.com/maps/dir/?api=1&origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}&travelmode=driving`;
        } else {
            // Fallback (e.g. Web, unknown)
            url = `https://www.google.com/maps/dir/?api=1&origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}&travelmode=driving`;
        }

        const supported = await Linking.canOpenURL(url);
        if (supported) {
            await Linking.openURL(url);
        } else {
            console.warn("Can't open maps with URL:", url);
        }
    }

    async function share(params: {
        lat: number;
        lng: number;
    }) {
        const { lat, lng } = params;
        const url =
            Platform.OS === "ios"
                ? `http://maps.apple.com/?ll=${lat},${lng}`
                : `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

        try {
            await Share.share({
                message: `Here's my location: ${url}`,
                url, // iOS will also use this
            });
        } catch (error) {
            console.error("Error sharing location:", error);
        }
    }

    return {
        formatDistance,
        location,
        isLocationAvailable: !!location,
        getDistance,
        openRoute,
        share
    };
}