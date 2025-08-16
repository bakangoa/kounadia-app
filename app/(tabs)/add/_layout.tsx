import { Stack } from "expo-router";
import { useTranslation } from "react-i18next";

export default function AddLayout() {
    const {t} = useTranslation("add");
    return (
        <Stack>
            <Stack.Screen name="index" options={{ headerShown: true, title: t('title') }} />
        </Stack>
    );
}
