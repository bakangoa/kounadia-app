import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import "@/global.css";
import "@/src/di/register";
import { store } from "@/src/store";
import { Stack } from "expo-router";
import { Provider } from "react-redux";

export default function RootLayout() {
  return (
    <GluestackUIProvider mode="light">
      <Provider store={store}>
        <Stack />
      </Provider>
    </GluestackUIProvider>
  );
}
