import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Center } from "@/components/ui/center";
import { Grid, GridItem } from "@/components/ui/grid";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { ChevronDownIcon, LoaderIcon, ShareIcon } from "@/components/ui/icon";
import { Image } from "@/components/ui/image";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useGeolocation } from "@/src/shared/hooks/use-geolocation.hook";
import { useNavigate } from "@/src/shared/hooks/use-navigate";
import { ScreenLayout } from "@/src/shared/layouts/screen.layout";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { MosqueDetailTabs } from "../components/mosque-detail-tabs.component";
import { useGetMosque } from "../hooks/use-get-mosque.hook";

interface Props {
    id: string
}

export function DetailScreen(props: Props) {
    const { navigateBack } = useNavigate();
    const { get, isLoading, mosque } = useGetMosque()
    const { t } = useTranslation("home");
    const { formatDistance, share, openRoute } = useGeolocation();

    useEffect(() => {
        get(props.id)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.id])

    const handleBack = () => {
        navigateBack();
    }
    return (
        <ScreenLayout>
            {
                isLoading ? (
                    <Center>
                        <LoaderIcon className="w-8 h-8 animate-spin" />
                    </Center>
                ) : mosque ? (
                    <>
                        <HStack className="justify-between px-4">
                            <Button variant="link" onPress={handleBack}>
                                <ButtonIcon as={ChevronDownIcon} className="w-8 h-8" />
                            </Button>
                            <Button variant="link" onPress={() => share({
                                lat: mosque.location.latitude,
                                lng: mosque.location.longitude
                            })}>
                                <ButtonIcon as={ShareIcon} className="w-8 h-8" />
                            </Button>
                        </HStack >
                        <VStack className="flex-1 bg-white p-4 gap-4">
                            <Heading className="text-2xl font-medium">
                                {mosque?.name}
                            </Heading>
                            <Text>
                                {mosque?.location.address}
                            </Text>
                            <HStack space="md">
                                <Text className={mosque?.isOpen ? "text-green-500" : "text-red-500"}>
                                    {mosque?.isOpen ? t("opened") : t("closed")}
                                </Text>
                                <Text>
                                    {
                                        mosque?.isOpen ? t("closed_at", { time: mosque.openCloseHour }) : t("open_at", { time: mosque.openCloseHour })
                                    }
                                </Text>
                                <Text>
                                    {formatDistance(mosque.distance)}
                                </Text>
                            </HStack>
                            <HStack space="md">
                                <Button className="rounded-full" onPress={() => openRoute({
                                    lat: mosque.location.latitude,
                                    lng: mosque.location.longitude
                                })}>
                                    <ButtonIcon />
                                    <ButtonText className="capitalize-first">
                                        {t('route')}
                                    </ButtonText>
                                </Button>
                                <Button className="rounded-full" onPress={() => share({
                                    lat: mosque.location.latitude,
                                    lng: mosque.location.longitude
                                })}>
                                    <ButtonIcon />
                                    <ButtonText className="capitalize-first">
                                        {t('share')}
                                    </ButtonText>
                                </Button>
                            </HStack>
                            {
                                mosque.photos && mosque.photos.length > 0 && (
                                    <Grid className="gap-2" _extra={{
                                        className: "grid-cols-3 grid-rows-2"
                                    }}>
                                        <GridItem _extra={{ className: `col-span-${mosque.photos.length <= 2 ? 3 : 2} row-span-2` }}>
                                            <Image
                                                source={{
                                                    uri: mosque.photos[0] || "https://placehold.co/400"
                                                }}
                                                alt={`${mosque.name}-0`}
                                                size="none"
                                                className="w-auto h-[257px] rounded-lg"
                                            />
                                        </GridItem>
                                        {
                                            mosque.photos.length > 2 && (
                                                mosque.photos.slice(1, 2).map((photo, index) => (
                                                    <GridItem key={index} _extra={{ className: "col-span-1 row-span-1" }}>
                                                        <Image
                                                            source={{
                                                                uri: photo || "https://placehold.co/400"
                                                            }}
                                                            alt={`${mosque.name}-${index + 1}`}
                                                            size="none"
                                                            className="w-40 h-40 rounded-lg"
                                                        />
                                                    </GridItem>
                                                ))
                                            )
                                        }
                                    </Grid>
                                )
                            }
                        </VStack>
                        <MosqueDetailTabs />
                    </>
                ) : (
                    <Center>
                        <Text>
                            Mosque not found
                        </Text>
                    </Center>
                )
            }
        </ScreenLayout >
    )
}