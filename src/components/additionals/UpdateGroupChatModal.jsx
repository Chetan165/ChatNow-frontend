import React, { useEffect } from "react";
import {
  Box,
  Button,
  CloseButton,
  Dialog,
  For,
  HStack,
  IconButton,
  Input,
  Loader,
  Portal,
  Text,
  Avatar,
} from "@chakra-ui/react";
import { toaster } from "../ui/toaster";
import axios from "axios";
import { useState } from "react";
import { ChatState } from "@/Context/ChatProvider";
import UserBadgeItem from "./UserBadgeItem";

const UpdateGroupChatModal = ({
  fetchAgain,
  setFetchAgain,
  openUpdateGroupDialog,
  setOpenUpdateGroupDialog,
  loadMessages,
}) => {
  const { chats, setChats } = ChatState();
  const { selectedChat, setSelectedChat } = ChatState();
  const { user, token } = ChatState();
  const [selectedUsers, setSelectedUsers] = useState(selectedChat.users);
  const [groupName, setGroupName] = useState(selectedChat.ChatName);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchResult, setSearchresult] = useState([]);

  const handleSave = async () => {
    setLoading(true);
    try {
      if (groupName.trim() === "") {
        toaster.create({
          title: "Group name cannot be empty",
          type: "warning",
        });
        return;
      } else if (groupName !== selectedChat.ChatName) {
        const { data } = await axios.put(
          "http://localhost:3000/chat/rename",
          {
            chatId: selectedChat._id,
            chatName: groupName,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSelectedChat(data.updatedChat);
        setFetchAgain(!fetchAgain);
        toaster.create({
          title: "Group name updated successfully",
          type: "success",
        });
      }

      //
      if (selectedUsers.length > 2) {
        const results = [];
        selectedChat.users.forEach((u) => {
          if (!selectedUsers.find((sel) => sel._id === u._id)) {
            const result = axios.put(
              "http://localhost:3000/chat/removeFrom",
              {
                chatId: selectedChat._id,
                userId: u._id,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            results.push(result);
          }
        });
        selectedUsers.forEach((u) => {
          if (!selectedChat.users.find((sel) => sel._id === u._id)) {
            const result = axios.put(
              "http://localhost:3000/chat/addTo",
              {
                chatId: selectedChat._id,
                userId: u._id,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            results.push(result);
          }
        });
        await Promise.all(results);
        loadMessages();
        setFetchAgain(!fetchAgain);
        setSelectedChat({ ...selectedChat, users: selectedUsers });
        toaster.create({
          title: "Group members updated successfully",
          type: "success",
        });
      } else {
        toaster.create({
          title: "A group chat must have at least 2 members",
          type: "warning",
        });
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  const updateSerach = (userToAdd) => {
    if (selectedUsers.find((sel) => sel._id === userToAdd._id)) {
      toaster.create({
        title: "User already added",
        type: "warning",
      });
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
  };
  const handleSearch = async (query) => {
    if (!query || query === "") return;
    setLoading(true);
    try {
      const result = await axios.get(
        `http://localhost:3000/api/user/?search=${query}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (result.data.ok) {
        console.log(result.data.users);
        setSearchresult(result.data.users);
      } else {
        throw Error("Error in search");
      }
    } catch (err) {
      console.log(err);
      toaster.create({
        title: "Error Occurred!",
        description: "Failed to Load the Search Results",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };
  const updateUser = (userToRemove) => {
    console.log(userToRemove);
    setSelectedUsers(
      selectedUsers.filter((sel) => sel._id !== userToRemove._id)
    );
  };

  useEffect(() => {
    setSelectedUsers(selectedChat.users);
  }, [openUpdateGroupDialog]);
  useEffect(() => {
    const timerId = setTimeout(() => {
      handleSearch(query);
    }, 500);
    return () => clearTimeout(timerId);
  }, [query]);
  useEffect(() => {
    setSelectedUsers(selectedChat.users);
    setGroupName(selectedChat.ChatName);
  }, [selectedChat]);

  return (
    <div>
      <Dialog.Root
        open={openUpdateGroupDialog}
        onOpenChange={(e) => setOpenUpdateGroupDialog(!e)}
        placement={"center"}
        motionPreset="slide-in-bottom"
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Edit Group</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <Box
                  display={"flex"}
                  flexDirection={"row"}
                  flexWrap={"wrap"}
                  gap={2}
                >
                  {selectedUsers?.map((u) => (
                    <UserBadgeItem
                      key={u._id}
                      user={u}
                      Me={user.UserName}
                      handleFunction={updateUser}
                    />
                  ))}
                  <Box
                    display={"flex"}
                    flexDirection={"row"}
                    alignItems={"center"}
                    width={"100%"}
                  >
                    <Input
                      value={groupName}
                      placeholder="Edit Group Name"
                      onChange={(e) => setGroupName(e.target.value)}
                    ></Input>
                  </Box>
                  <Input
                    placeholder="Add New User"
                    onChange={(e) => setQuery(e.target.value)}
                  ></Input>
                  {loading ? (
                    <Loader />
                  ) : (
                    searchResult.slice(0, 4).map((u) => {
                      return loading ? (
                        <></>
                      ) : (
                        <Box
                          display={"flex"}
                          flexDirection={"row"}
                          justifyContent={"flex-start"}
                          alignItems={"center"}
                          cursor="pointer"
                          bg={"#38B2AC"}
                          color={"white"}
                          px={3}
                          py={2}
                          gap={3}
                          width={"full"}
                          borderRadius="lg"
                          key={u._id}
                          onClick={() => updateSerach(u)}
                        >
                          <Avatar.Root size={"md"}>
                            <Avatar.Fallback name={u.UserName} />
                            <Avatar.Image src={u.Picture} />
                          </Avatar.Root>
                          <Text key={u._id}>{u.Name}</Text>
                        </Box>
                      );
                    })
                  )}
                </Box>
              </Dialog.Body>
              <Dialog.Footer>
                <Button bg={"white"} onClick={() => handleSave()}>
                  Submit
                </Button>
              </Dialog.Footer>
              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Dialog.CloseTrigger>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </div>
  );
};

export default UpdateGroupChatModal;
