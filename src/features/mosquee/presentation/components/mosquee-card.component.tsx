import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Image } from "@/components/ui/image";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useGeolocation } from "@/src/shared/hooks/use-geolocation.hook";
import { useTranslation } from "react-i18next";
import { ScrollView } from "react-native";
import { SearchMosqueeItem } from "../../application/search-mosquee.usecase";

type Props = SearchMosqueeItem;

export function MosqueeCard(props: Props) {
    const { t } = useTranslation();
    const { formatDistance } = useGeolocation()
    return (
        <VStack className="bg-white gap-3 pl-6 py-3">
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <HStack className="gap-2">
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
            <VStack>
                <Heading className="text-3xl font-medium">{props.name}</Heading>
                <HStack space="md">
                    <Text className={props.isOpen ? "text-green-500" : "text-red-500"}>
                        {props.isOpen ? "Ouvert" : "Fermé"}
                    </Text>
                    <Text>
                        {
                            props.isOpen ? `Ferme à ` : `Ouvre à `
                        }
                        {props.openCloseHour}
                    </Text>
                    <Text>
                        {formatDistance(props.distance)}
                    </Text>
                </HStack>
            </VStack>
            <HStack className="gap-2">
                <Button className="rounded-full">
                    <ButtonIcon />
                    <ButtonText className="capitalize-first">
                        {t('route')}
                    </ButtonText>
                </Button>
                <Button className="rounded-full">
                    <ButtonIcon />
                    <ButtonText className="capitalize-first">
                        {t('share')}
                    </ButtonText>
                </Button>
                <Button className="rounded-full">
                    <ButtonIcon />
                    <ButtonText className="capitalize-first">
                        {t('Favorite')}
                    </ButtonText>
                </Button>
            </HStack>
        </VStack>
    )
}