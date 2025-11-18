import React, { useContext, useEffect, useState } from "react";
import { ChatState } from "@/Context/ChatProvider";
import { ModalState } from "@/Context/ModalProvider";
import { toaster } from "./ui/toaster";
import axios from "axios";
import {
  Box,
  Button,
  Stack,
  Text,
  HStack,
  Avatar,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
} from "@chakra-ui/react";
import GroupModal, { GroupModalState } from "./additionals/GroupModal";
const MyChats = ({ fetchAgain }) => {
  const { user, chats, setChats, selectedChat, setSelectedChat, token } =
    ChatState();
  const { open, setOpen, setUser, setData } = ModalState();
  const [loggedUser, setLoggedUser] = React.useState();
  const { openGroupDialog, setOpenGroupDialog } = ChatState();
  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.get(
        "http://localhost:3000/chat/fetch",
        config
      );
      setChats(data.chats);
    } catch (err) {
      toaster.create({
        title: "Error Occurred!",
        description: "Failed to Load the chats",
        type: "error",
      });
    }
  };
  useEffect(() => {
    console.log("updated chats");
    fetchChats();
  }, [selectedChat, fetchAgain]);
  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir={"column"}
      alignItems={"center"}
      padding={3}
      bg={"white"}
      width={{ base: "100%", md: "45%", lg: "33%" }}
      borderRadius={"lg"}
      borderWidth={"1px"}
    >
      <Box
        paddingBottom={3}
        paddingX={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily={"Work sans"}
        display={"flex"}
        width={"100%"}
        justifyContent={"space-between"}
        color={"black"}
        gap={2}
      >
        MyChats
        <GroupModal>
          <Button
            display={"flex"}
            color={"white"}
            fontSize={{ base: "10px", md: "12px", lg: "14px" }}
            onClick={() => setOpenGroupDialog(true)}
          >
            <Text display={{ base: "none", md: "flex" }}>New Group Chat</Text>{" "}
            <i class="fa-sharp-duotone fa-solid fa-plus"></i>
          </Button>
        </GroupModal>
      </Box>
      <Box
        display={"flex"}
        flexDir={"column"}
        padding={3}
        bg={"#F8F8F8"}
        width={"100%"}
        height={"100%"}
        borderRadius={"lg"}
        overflowY={"hidden"}
      >
        {chats.length ? (
          <Stack
            overflowY={"auto"}
            sx={{
              "::-webkit-scrollbar": {
                display: "none",
              },
            }}
          >
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                display={"flex"}
                flexDirection={"row"}
                justifyContent={"flex-start"}
                alignItems={"center"}
                cursor="pointer"
                bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                gap={3}
                borderRadius="lg"
                key={chat._id}
              >
                <Avatar.Root size={"md"}>
                  <Avatar.Fallback
                    name={
                      chat.isGroupChat
                        ? chat.chatName
                        : chat.users.find((u) => u._id !== user.User_id).Name
                    }
                  />
                  <Avatar.Image
                    src={
                      chat.isGroupChat
                        ? chat.chatName
                        : chat.users.find((u) => u._id !== user.User_id).Picture
                    }
                  />
                </Avatar.Root>
                <Text>
                  {chat.isGroupChat
                    ? chat.ChatName
                    : chat.users.find((u) => u._id !== user.User_id).Name}
                </Text>
              </Box>
            ))}
          </Stack>
        ) : (
          <Stack gap="6" maxW="xs">
            <HStack width="full">
              <SkeletonCircle size="10" />
              <SkeletonText noOfLines={2} />
            </HStack>
            <Skeleton height="50px" />
          </Stack>
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
