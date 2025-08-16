
import { Box } from "@/components/ui/box";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Image } from "@/components/ui/image";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useGeolocation } from "@/src/shared/hooks/use-geolocation.hook";
import { useTranslation } from "react-i18next";
import { SearchMosqueItem } from "../../application/search-mosque.usecase";

type Props = SearchMosqueItem

export function MosqueMapCard(props: Props) {
    const { t } = useTranslation("home");
    const { formatDistance } = useGeolocation()
    return (
        <Card className="bg-white py-4 m-4">
            <Box className="flex flex-row gap-4">
                <Image
                    source={{
                        uri: props.photos[0] || "https://via.placeholder.com/150"
                    }}
                    alt={`${props.name}`}
                    size="none"
                    className="w-24 h-24 rounded-lg"
                />
                <VStack className="grow">
                    <Heading className="text-3xl font-medium text-wrap line-clamp-2">{props.name}</Heading>
                    <Box className="flex flex-row gap-2">
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
                    </Box>
                </VStack>
            </Box>
        </Card>
    )
}