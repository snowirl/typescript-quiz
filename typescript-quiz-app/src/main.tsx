import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { UserContextProvider } from "./context/userContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <NextUIProvider>
    <NextThemesProvider attribute="class" defaultTheme="dark">
      <UserContextProvider>
        <App />
      </UserContextProvider>
    </NextThemesProvider>
  </NextUIProvider>
);
