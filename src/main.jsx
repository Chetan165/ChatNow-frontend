import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Provider } from "@/components/ui/provider";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import ChatProvider from "./Context/ChatProvider.jsx";
import ModalProvider from "./Context/ModalProvider";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ChatProvider>
      <Provider>
        <ModalProvider>
          <App />
        </ModalProvider>
      </Provider>
    </ChatProvider>
  </BrowserRouter>
);
