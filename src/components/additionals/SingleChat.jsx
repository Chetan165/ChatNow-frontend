import React from "react";
import { Box, IconButton, Text } from "@chakra-ui/react";
import { ChatState } from "@/Context/ChatProvider";
const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat } = ChatState();
  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            width={"100%"}
            fontFamily={"Work sans"}
            display={"flex"}
            flexDirection={"column"}
            justifyContent={{ base: "space-between" }}
            alignItems={"flex-start"}
            color={"black"}
          >
            <IconButton bg={"gray.200"} onClick={() => setSelectedChat("")}>
              <i class="fa-solid fa-arrow-left"></i>
            </IconButton>
          </Text>
        </>
      ) : (
        <Box
          alignItems={"center"}
          p={3}
          fontSize={{ base: "28px", md: "30px" }}
          fontFamily={"Work sans"}
          height={"100%"}
          display={"flex"}
          width={"100%"}
          justifyContent={"center"}
          color={"black"}
        >
          Click on a user to start chatting
        </Box>
      )}
    </>
  );
};

export default SingleChat;
