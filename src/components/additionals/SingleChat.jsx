import React from "react";
import { useState } from "react";
import { Box, IconButton, Text } from "@chakra-ui/react";
import { ChatState } from "@/Context/ChatProvider";
import UpdateGroupChatModal from "./UpdateGroupChatModal";
const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat } = ChatState();
  const [openUpdateGroupDialog, setOpenUpdateGroupDialog] = useState(false);
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
            flexDirection={"row"}
            gap={{ base: "2" }}
            justifyContent={{ base: "flex-start" }}
            alignItems={"flex-start"}
            color={"black"}
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              bg={"gray.200"}
              onClick={() => setSelectedChat("")}
            >
              <i class="fa-solid fa-arrow-left"></i>
            </IconButton>
            {selectedChat.isGroupChat ? (
              <Box
                width={"100%"}
                display={"flex"}
                flexDirection={"row"}
                justifyContent={"space-between"}
              >
                <Text>{selectedChat.ChatName}</Text>
                <IconButton
                  color={"white"}
                  onClick={() => setOpenUpdateGroupDialog(true)}
                >
                  {user.User_id === selectedChat.groupAdmin._id ? (
                    <i class="fas fa-edit"></i>
                  ) : (
                    <></>
                  )}
                </IconButton>
              </Box>
            ) : (
              selectedChat.users.map((u) => {
                return (
                  <>
                    {u._id === user.User_id ? (
                      <></>
                    ) : (
                      <Text key={u._id}>{u.Name}</Text>
                    )}
                  </>
                );
              })
            )}
          </Text>
          <Box
            display={"flex"}
            flexDirection={"column"}
            height={"100%"}
            width={"100%"}
            flex={1}
            overflowY={"hidden"}
            bg={"#E8E8E8"}
            borderRadius={"lg"}
          >
            <Text color={"gray.800"}>Messages Here</Text>
            <UpdateGroupChatModal
              fetchAgain={fetchAgain}
              setFetchAgain={setFetchAgain}
              openUpdateGroupDialog={openUpdateGroupDialog}
              setOpenUpdateGroupDialog={setOpenUpdateGroupDialog}
            />
          </Box>
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
