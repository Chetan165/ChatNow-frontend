import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Flex, Text } from "@chakra-ui/react";
import { ChatState } from "@/Context/ChatProvider";
import SideDrawer from "../components/additionals/SideDrawer";
import ChatBox from "@/components/ChatBox";
import MyChats from "@/components/MyChats";
import { useNavigate } from "react-router-dom";

const ChatPage = () => {
  const [fetchAgain, setFetchAgain] = useState(false);
  const navigate = useNavigate();
  const { user, token } = ChatState();
  const [chats, setChats] = useState([]);
  const fetchChat = async () => {};
  useEffect(() => fetchChat, []);
  useEffect(() => {
    if (!token || token === "") {
      console.log("No token found, redirecting to login");
      navigate("/");
    }
  });
  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        w={"100%"}
        h={"91.5vh"}
        p={"10px"}
      >
        {user && (
          <MyChats fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>
  );
};

export default ChatPage;
