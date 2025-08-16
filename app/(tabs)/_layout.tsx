import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';

export default function TabLayout() {
    const {t} = useTranslation();
    return (
        <>
            <Tabs>
                <Tabs.Screen name="home" options={{ headerShown: false, title: t('home') }} />
                <Tabs.Screen name="add" options={{ headerShown: false, title: t('add') }} />
            </Tabs>
        </>
    );
}
