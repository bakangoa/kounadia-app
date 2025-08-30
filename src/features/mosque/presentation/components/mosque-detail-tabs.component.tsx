import { Box } from "@/components/ui/box";
import { Grid, GridItem } from "@/components/ui/grid";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Image } from "@/components/ui/image";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { AlarmClockIcon, MailIcon, MapPinIcon, PencilLineIcon, PhoneIcon } from "lucide-react-native";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView } from "react-native";
import { useGetMosque } from "../hooks/use-get-mosque.hook";

const headers: {
    title: string
}[] = [
        {
            title: "About"
        },
        {
            title: "Photos"
        }
    ];

const days = ["form.monday", "form.tuesday", "form.wednesday", "form.thursday", "form.friday", "form.saturday", "form.sunday"]

export function MosqueDetailTabs() {
    const [activeIndex, setActiveIndex] = useState(0);
    const { t } = useTranslation("home");
    const { t: tForm } = useTranslation("add");
    const { mosque } = useGetMosque();

    if (!mosque) {
        throw new Error("Mosque not found");
    }

    function handleChangeTab(index: number) {
        setActiveIndex(index);
    }

    return (
        <VStack className="bg-white">
            <HStack className="border-b border-background-300 px-4">
                {
                    headers.map((header, index) => (
                        <Pressable key={index} onPress={() => handleChangeTab(index)}>
                            <Box
                                className={`px-4 py-2 ${activeIndex === index && "border-b-2 border-primary-700"}`}
                            >
                                <Text className={activeIndex === index ? "text-primary-700" : ""}>
                                    {header.title}
                                </Text>
                            </Box>
                        </Pressable>
                    ))
                }
            </HStack>
            <Box className="grow">
                {
                    activeIndex === 0 && (
                        <VStack>
                            <HStack className="gap-6 p-4 border-b border-background-100">
                                <Icon as={MapPinIcon} className="text-primary-700" />
                                <Text>{mosque.location.address}</Text>
                            </HStack>
                            <HStack className="gap-6 p-4 border-b border-background-100">
                                <Icon as={PhoneIcon} />
                                <Text>{mosque.phone}</Text>
                            </HStack>
                            <HStack className="gap-6 p-4 border-b border-background-100">
                                <Icon as={AlarmClockIcon} />
                                <VStack>
                                    <Text>
                                        {
                                            t("schedule")
                                        }
                                    </Text>
                                    <VStack className="gap-2">
                                        {
                                            mosque.openingHours.map((shift, index) => (
                                                <HStack key={index} className="gap-4">
                                                    <Text>{tForm(days[shift.dayOfWeek])}</Text>
                                                    <Text>{shift.openTime} - {shift.closeTime}</Text>
                                                </HStack>
                                            ))
                                        }
                                    </VStack>
                                </VStack>
                            </HStack>
                            <HStack className="gap-6 p-4 border-b border-background-100">
                                <Icon as={PhoneIcon} />
                                <Text>{mosque.website}</Text>
                            </HStack>
                            <HStack className="gap-6 p-4 border-b border-background-100">
                                <Icon as={MailIcon} />
                                <Text>{mosque.email}</Text>
                            </HStack>
                            <HStack className="gap-6 p-4 border-b border-background-100">
                                <Icon as={PencilLineIcon} />
                                <VStack>
                                    <Text>
                                        {
                                            t("description")
                                        }
                                    </Text>
                                    <Text>{mosque.description}</Text>
                                </VStack>
                            </HStack>
                        </VStack>
                    )
                }
                {
                    activeIndex === 1 && (
                        <ScrollView>
                            <Grid className="gap-2 p-4" _extra={{
                                className: 'grid-cols-2'
                            }}>
                                {
                                    mosque.photos?.map((photo, index) => (
                                        <GridItem key={index} _extra={{
                                            className: 'col-span-1'
                                        }}>
                                            <Image
                                                source={{
                                                    uri: photo || "https://via.placeholder.com/150"
                                                }}
                                                alt={`${mosque.name} #${index + 1}`}
                                                size="none"
                                                className="w-full h-40"
                                            />
                                        </GridItem>
                                    ))
                                }
                            </Grid>
                        </ScrollView>
                    )
                }
            </Box>
        </VStack>
    )
}