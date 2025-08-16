import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import "@/global.css";
import { store } from "@/src/store";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Provider } from "react-redux";


import { AppModule } from "@/src/app.module";
import "@/src/locales/i18n";

AppModule.register!();
AppModule.initialize!();

export default function RootLayout() {
  return (
    <GluestackUIProvider mode="light">
      <Provider store={store}>
        <StatusBar backgroundColor="#fff" />
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="add-form" options={{ headerShown: false }} />
          <Stack.Screen name="mosque/[id]" options={{ headerShown: false, animation: "slide_from_bottom" }} />
        </Stack>
      </Provider>
    </GluestackUIProvider>
  );
}
