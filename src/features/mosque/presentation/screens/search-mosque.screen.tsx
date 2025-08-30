import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
import { Input, InputField } from "@/components/ui/input";
import { VStack } from "@/components/ui/vstack";
import { Maps } from "@/src/shared/components/maps.component";
import { useConstants } from "@/src/shared/hooks/use-contants.hook";
import { useGeolocation } from "@/src/shared/hooks/use-geolocation.hook";
import { useNavigate } from "@/src/shared/hooks/use-navigate";
import { ScreenLayout } from "@/src/shared/layouts/screen.layout";
import { FlashList } from "@shopify/flash-list";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable } from "react-native";
import { SearchMosqueItem } from "../../application/search-mosque.usecase";
import { MosqueCard } from "../components/mosque-card.component";
import { MosqueMapCard } from "../components/mosque-map-card.component";
import { useSearchMosque } from "../hooks/use-search-mosque.hook";

const MarkerIcon = "https://ngovnpbvytakxpgxrccq.supabase.co/storage/v1/object/public/statics//Pin%202.png";

export function SearchMosqueScreen() {
    const { t } = useTranslation("home");
    const { APP_NAME } = useConstants();
    const { mosques, searchTerm, handleSearchChange, loadMore, refresh, isRefreshing } = useSearchMosque();

    const { location: userLocation } = useGeolocation();
    const [showMap, setShowMap] = useState(false);
    const [selectedMosque, setSelectedMosque] = useState<SearchMosqueItem | null>(null);
    const { navigateToMosqueDetails } = useNavigate();

    function handleSearchPressed() {
        setShowMap(true);
    }

    function handleMarkerPressed(key: string) {
        const mosque = mosques.find((mosque) => mosque.id === key);
        if (mosque) {
            console.log("handleMarkerPressed", mosque);
            setSelectedMosque(mosque);
        }
    }

    function handleShowDetails(id: string) {
        navigateToMosqueDetails(id);
    }

    return (
        <ScreenLayout>
            <VStack className="flex-1 pt-4 gap-4">
                <VStack className={`px-6 gap-2 ${showMap ? "items-center" : ""}`}>
                    <Heading className="text-2xl">
                        {
                            showMap ? t("maps_title") : t('welcome', { appName: APP_NAME })
                        }
                    </Heading>
                    {
                        !showMap && (
                            <Input>
                                <InputField
                                    className="bg-white rounded-lg border border-slate-300"
                                    placeholder={t("search_placeholder")}
                                    value={searchTerm}
                                    onPress={handleSearchPressed}
                                    onChangeText={handleSearchChange}
                                />
                            </Input>
                        )
                    }
                </VStack>
                <Box className={`grow relative`}>
                    {
                        showMap ? (
                            <>
                                <Maps
                                    location={userLocation ? {
                                        lat: userLocation.coords.latitude,
                                        lng: userLocation.coords.longitude
                                    } : undefined}
                                    markerIcon={MarkerIcon}
                                    onMarkedLocationPress={handleMarkerPressed}
                                    markerLocations={mosques.map((mosque) => ({ key: mosque.id, coords: { latitude: mosque.locations.latitude, longitude: mosque.locations.longitude } }))}
                                />
                                <Box className="absolute top-5 px-6 w-full">
                                    <Input>
                                        <InputField
                                            className="bg-white rounded-lg border border-slate-300"
                                            placeholder={t("search_placeholder")}
                                            value={searchTerm}
                                            onPress={handleSearchPressed}
                                            onChangeText={handleSearchChange}
                                        />
                                    </Input>
                                </Box>
                                {
                                    selectedMosque && (
                                        <Box className="absolute bottom-5">
                                            <Pressable onPress={() => handleShowDetails(selectedMosque.id)}>
                                                <MosqueMapCard {...selectedMosque} />
                                            </Pressable>
                                        </Box>
                                    )
                                }
                            </>
                        ) : (
                            <FlashList
                                data={mosques}
                                renderItem={({ item }) =>
                                    <MosqueCard {...item} />}
                                onRefresh={refresh}
                                refreshing={isRefreshing}
                                estimatedItemSize={100}
                                keyExtractor={(item) => item.id.toString()}
                                onEndReached={loadMore}
                                onEndReachedThreshold={0.5}
                                ItemSeparatorComponent={() => <Box className="h-4" />}
                            />
                        )
                    }
                </Box>
            </VStack>
        </ScreenLayout>
    );
}