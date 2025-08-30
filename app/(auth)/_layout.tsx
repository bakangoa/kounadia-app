import { Stack } from "expo-router";

export default function AuthLayout() {
    return (
        <Stack initialRouteName="onboarding">
            <Stack.Screen name="onboarding" options={{ headerShown: false }} />
            <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen name="register" options={{ headerShown: false }} />
        </Stack>
    );
}
