import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import "@/global.css";
import { store } from "@/src/store";
import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider } from "react-redux";


import { AppModule } from "@/src/app.module";
import { useAuth } from "@/src/features/auth/presentation/hooks/use-auth.hook";
import "@/src/locales/i18n";
import { Toasts } from "@backpackapp-io/react-native-toast";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

AppModule.register!();
AppModule.initialize!();

SplashScreen.preventAutoHideAsync();

function Layout() {
  const { checkIfAuthenticated, isChecked, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    checkIfAuthenticated();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isChecked) {
      SplashScreen.hideAsync();
    }
  }, [isChecked]);

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return (
      <Stack>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      </Stack>
    )
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="add-form" options={{ headerShown: false }} />
      <Stack.Screen name="mosque/[id]" options={{ headerShown: false, animation: "slide_from_bottom" }} />
    </Stack>
  )
}

export default function RootLayout() {
  return (
    <GluestackUIProvider mode="light">
      <Provider store={store}>
        <SafeAreaProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <StatusBar backgroundColor="#fff" />
            <Layout />
            <Toasts />
          </GestureHandlerRootView>
        </SafeAreaProvider>
      </Provider>
    </GluestackUIProvider>
  );
}
