import { Tabs } from 'expo-router';
import { StatusBar } from "expo-status-bar";
import { useTranslation } from 'react-i18next';

export default function TabLayout() {
    const {t} = useTranslation();
    return (
        <>
            <StatusBar backgroundColor="#E6F68E" />
            <Tabs>
                <Tabs.Screen name="(home)" options={{ headerShown: false, title: t('home') }} />
                <Tabs.Screen name="(add)" options={{ headerShown: false, title: t('add') }} />
            </Tabs>
        </>
    );
}
