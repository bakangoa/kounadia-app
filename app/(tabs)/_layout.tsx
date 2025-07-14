import { Tabs } from 'expo-router';
import { StatusBar } from "expo-status-bar";

export default function TabLayout() {
    return (
        <>
            <StatusBar backgroundColor="#E6F68E" />
            <Tabs>
                <Tabs.Screen name="(home)" options={{ headerShown: false }} />
            </Tabs>
        </>
    );
}
