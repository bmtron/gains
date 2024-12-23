import { Stack } from "expo-router";
import { PaperProvider, MD2DarkTheme } from "react-native-paper";
import { Provider } from "react-redux";
import store from "../state_store/store";
export default function RootLayout() {
  return (
    <Provider store={store}>
      <PaperProvider theme={MD2DarkTheme}>
        <Stack />
      </PaperProvider>
    </Provider>
  );
}
