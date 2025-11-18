import { Box, Text } from "@chakra-ui/react";
import React from "react";
import { ChatState } from "@/Context/ChatProvider";
import SingleChat from "./additionals/SingleChat";
const ChatBox = () => {
  const { selectedChat, fetchAgain, setFetchAgain } = ChatState();
  return (
    <Box
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      flexDirection={"column"}
      alignItems={"center"}
      padding={3}
      bg={"white"}
      width={{ base: "100%", md: "68%" }}
      borderRadius={"lg"}
      borderWidth={"1px"}
      height={"100%"}
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );
};

export default ChatBox;
