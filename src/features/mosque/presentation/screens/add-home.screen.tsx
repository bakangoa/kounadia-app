import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Image } from "@/components/ui/image";
import { Text } from "@/components/ui/text";
import { useNavigate } from "@/src/shared/hooks/use-navigate";
import { useTranslation } from "react-i18next";


export function AddHomeScreen() {
    const { t } = useTranslation("add");
    const { navigateToAddForm } = useNavigate();

    const handleAdd = () => {
        navigateToAddForm();
    }
    return (
        <Box className="flex-1 p-4">
            <Card className="p-6 rounded-xl border-gray-300 border items-center gap-6 mt-8">
                <Image
                    source={{
                        uri: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1350&q=80"
                    }}
                    alt="Add Home"
                    className="w-full h-60 object-cover rounded-xl"
                    resizeMode="cover"
                />
                <Heading className="text-3xl font-medium text-center">
                    {t("home.card_title")}
                </Heading>
                <Text className="text-center">
                    {t("home.card_description")}
                </Text>
                <Button action="primary" variant="link" onPress={handleAdd}>
                    <ButtonText>
                        {t("home.card_button")}
                    </ButtonText>
                </Button>
            </Card>
        </Box>
    )
}