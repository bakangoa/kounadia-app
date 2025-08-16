

import { Asset } from "expo-asset";
import * as FileSystem from "expo-file-system";
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, NativeSyntheticEvent } from 'react-native';
import { LatLng, LeafletView, MapMarker, WebviewLeafletMessage } from 'react-native-leaflet-view';
import { WebViewError } from "react-native-webview/lib/WebViewTypes";

const DEFAULT_LOCATION = {
    latitude: -23.5489,
    longitude: -46.6388
}

interface MarkedLocation {
    key: string;
    coords: LatLng
}

interface Props {
    location?: LatLng;
    selectedLocation?: LatLng;
    onSelectLocation?: (location: LatLng) => void,
    markerIcon?: string // icon url
    markerLocations?: MarkedLocation[]
    onMarkedLocationPress?: (key: string) => void
}
export function Maps(props: Props) {
    const [webViewContent, setWebViewContent] = useState<string | null>(null);
    const [location, setLocation] = useState<LatLng>(DEFAULT_LOCATION);
    const [markers, setMarkers] = useState<MapMarker[]>();

    useEffect(() => {
        let isMounted = true;

        const loadHtml = async () => {
            console.log('Loading HTML...');
            try {
                const path = require("../../../assets/leaflet.html");
                const asset = Asset.fromModule(path);
                await asset.downloadAsync();
                const htmlContent = await FileSystem.readAsStringAsync(asset.localUri!);

                if (isMounted) {
                    setWebViewContent(htmlContent);
                }
            } catch (error) {
                Alert.alert('Error loading HTML', JSON.stringify(error));
                console.error('Error loading HTML:', error);
            }
        };

        loadHtml();

        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        if (props.selectedLocation && markers?.length === 0) {
            const marker: MapMarker = createMarker(props.selectedLocation);
            setMarkers([marker]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.selectedLocation]);

    useEffect(() => {
        if (props.location) {
            setLocation(props.location);
        }
    }, [props.location]);

    useEffect(() => {
        if (props.markerLocations) {
            const markers = props.markerLocations.map((location) => createMarkerWithId(location.key, {
                lat: location.coords.latitude,
                lng: location.coords.longitude
            }));
            setMarkers(markers);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.markerLocations]);

    if (!webViewContent) {
        return <ActivityIndicator size="large" />
    }

    function createMarker(location: LatLng) {
        const marker: MapMarker = {
            icon: props.markerIcon,
            position: location,
        };
        return marker;
    }

    function createMarkerWithId(id: string, location: LatLng) {
        const marker: MapMarker = {
            icon: props.markerIcon,
            position: location,
            id: id
        };
        return marker;
    }

    function onMessageReceived(message: WebviewLeafletMessage) {
        console.log("onMessageReceived", message);

        if (message.event === "onMove" && message.payload) {
            setLocation(message.payload.mapCenterPosition);
        }

        if (message.event === "onMapClicked" && message.payload) {
            if (props.onSelectLocation) {
                props.onSelectLocation(message.payload.touchLatLng);
                if (props.markerIcon) {
                    const marker: MapMarker = createMarker(message.payload.touchLatLng)
                    setMarkers([marker]);
                }
            }
        }

        if (message.event === "onMapMarkerClicked" && message.payload) {
            if (props.markerLocations && props.onMarkedLocationPress && message.payload) {
                console.log("onMarkerClicked", message.payload);
                const markerLocation = props.markerLocations.find((location) => location.key === message.payload?.mapMarkerID);
                console.log("markerLocation", markerLocation, message.payload.mapMarkerID, props.markerLocations.map((location) => location.key));
                if (markerLocation) {
                    console.log("onMarkerClicked", markerLocation);
                    props.onMarkedLocationPress(markerLocation.key);
                }
            }
        }
    }

    function onError(syntheticEvent: NativeSyntheticEvent<WebViewError>) {
        console.error("onError", syntheticEvent.nativeEvent.description);
    }
    return (
        <LeafletView
            source={{ html: webViewContent }}
            mapCenterPosition={{
                lat: location.latitude,
                lng: location.longitude,
            }}
            onMessageReceived={onMessageReceived}
            onError={onError}
            mapMarkers={markers}
        />
    );
}
