import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Center } from "@/components/ui/center";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { LogoFull } from "@/src/shared/components/logo-full.component";
import { useNavigate } from "@/src/shared/hooks/use-navigate";
import { useTranslation } from "react-i18next";


export default function Onboarding() {
    const { t } = useTranslation("onboarding");
    const { navigateToLogin, navigateToRegister } = useNavigate();

    return (
        <Box className="flex-1 bg-brand-50">
            <Center className="h-1/2 gap-4">
                <LogoFull />
                <Text className="font-semibold text-xl">
                    {t("subtitle")}
                </Text>
            </Center>
            <VStack className="grow items-center gap-6 px-8 bg-white pt-12">
                <Heading className="text-2xl font-semibold">
                    {t("welcome")}
                </Heading>
                <Text className="text-center">
                    {t("description")}
                </Text>
                <Button className="w-full bg-brand-500 rounded-full h-12" onPress={navigateToLogin}>
                    <ButtonText>
                        {t("login")}
                    </ButtonText>
                </Button>
                <Button variant="outline" className="w-full rounded-full h-12" onPress={navigateToRegister}>
                    <ButtonText>
                        {t("register")}
                    </ButtonText>
                </Button>
            </VStack>
        </Box>
    )
}