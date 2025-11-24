import { useState } from "react";
import "./App.css";
import bg from "./assets/background.png";
import Header from "./pages/Header.jsx";
import { Route, Routes } from "react-router-dom";
import Homepage from "./pages/Homepage.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import { Toaster, toaster } from "@/components/ui/toaster";

function App() {
  return (
    <div
      style={{
        backgroundColor: `black`, // your background image
        backgroundSize: "cover", // make it cover the whole div
        backgroundPosition: "center", // center the image
        backgroundRepeat: "no-repeat", // prevent repeating
        width: "100vw", // full viewport width
        height: "100vh", // full viewport height
      }}
    >
      <Routes>
        <Route path="/" element={<Homepage />}></Route>
        <Route path="/chats" element={<ChatPage />}></Route>
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
