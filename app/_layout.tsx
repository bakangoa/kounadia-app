import "@/src/di/register";
import { store } from "@/src/store";
import { Stack } from "expo-router";
import { Provider } from "react-redux";

export default function RootLayout() {
  return <Provider store={store}>
    <Stack />
  </Provider>;
}
