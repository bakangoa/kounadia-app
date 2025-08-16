import { Box } from "@/components/ui/box";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Image } from "@/components/ui/image";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useGeolocation } from "@/src/shared/hooks/use-geolocation.hook";
import { useNavigate } from "@/src/shared/hooks/use-navigate";
import { useTranslation } from "react-i18next";
import { ScrollView } from "react-native";
import { SearchMosqueItem } from "../../application/search-mosque.usecase";

type Props = SearchMosqueItem;

export function MosqueCard(props: Props) {
    const { t } = useTranslation("home");
    const { formatDistance, share, openRoute } = useGeolocation()
    const { navigateToMosqueDetails } = useNavigate()
    return (
        <VStack className="bg-white gap-3 py-3">
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <HStack className="gap-2">
                    <Box className="h-full w-4" />
                    {props.photos.map((photo, index) => (
                        <Image
                            source={{
                                uri: photo || "https://via.placeholder.com/150"
                            }}
                            key={index}
                            alt={`${props.name} #${index + 1}`}
                            size="none"
                            className="w-40 h-40 rounded-lg"
                        />
                    ))}
                </HStack>
            </ScrollView>
            <Pressable onPress={() => navigateToMosqueDetails(props.id)}>
                <VStack className="pl-6 ">
                    <Heading className="text-3xl font-medium">{props.name}</Heading>
                    <HStack space="md">
                        <Text className={props.isOpen ? "text-green-500" : "text-red-500"}>
                            {props.isOpen ? t("opened") : t("closed")}
                        </Text>
                        <Text>
                            {
                                props.isOpen ? t("closed_at", { time: props.openCloseHour }) : t("open_at", { time: props.openCloseHour })
                            }
                        </Text>
                        <Text>
                            {formatDistance(props.distance)}
                        </Text>
                    </HStack>
                </VStack>
            </Pressable>
            <HStack className="gap-2 pl-6 ">
                <Button className="rounded-full" onPress={() => openRoute({
                    lat: props.locations.latitude,
                    lng: props.locations.longitude
                })}>
                    <ButtonIcon />
                    <ButtonText className="capitalize-first">
                        {t('route')}
                    </ButtonText>
                </Button>
                <Button className="rounded-full" onPress={() => share({
                    lat: props.locations.latitude,
                    lng: props.locations.longitude
                })}>
                    <ButtonIcon />
                    <ButtonText className="capitalize-first">
                        {t('share')}
                    </ButtonText>
                </Button>
                {/* <Button className="rounded-full">
                    <ButtonIcon />
                    <ButtonText className="capitalize-first">
                        {t('favorite')}
                    </ButtonText>
                </Button> */}
            </HStack>
        </VStack >
    )
}