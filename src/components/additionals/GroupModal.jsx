import React, { useEffect, useState } from "react";
import { useContext, createContext } from "react";
import {
  Box,
  CloseButton,
  Dialog,
  Portal,
  Button,
  Input,
  Text,
  Spinner,
  Avatar,
} from "@chakra-ui/react";
import UserBadgeItem from "./UserBadgeItem";
import axios from "axios";
import { ChatState } from "@/Context/ChatProvider";
import { toaster } from "../ui/toaster";
const GroupModalContext = createContext();
const GroupModal = ({ children }) => {
  const {
    selectedChat,
    setSelectedChat,
    user,
    chats,
    setChats,
    token,
    openGroupDialog,
    setOpenGroupDialog,
  } = ChatState();

  const [query, setQuery] = useState("");
  const [searchResult, setSearchresult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState([]);
  const [groupChat, setGroupChat] = useState("");

  const handleDelete = (userToDelete) => {
    setSelectedUser(selectedUser.filter((sel) => sel._id !== userToDelete._id));
  };

  const handleSubmit = async () => {
    if (selectedUser.length < 2) {
      toaster.create({
        title: "More than 2 users are required",
        type: "warning",
      });
      return;
    } else {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const { data } = await axios.post(
          "http://localhost:3000/chat/createGroup",
          {
            name: groupChat,
            users: selectedUser.map((u) => u._id),
          },
          config
        );
        setChats([data.savedGroupChat, ...(chats ? chats : [])]);
        toaster.create({
          title: "New Group Chat Created!",
          type: "success",
        });
        setOpenGroupDialog(false);
      } catch (err) {
        console.log(err);
        toaster.create({
          title: "Error Occurred!",
          description: "Failed to create the group chat",
          type: "error",
        });
      }
    }
  };
  const handleGroup = async (userToAdd) => {
    if (selectedUser.includes(userToAdd)) {
      toaster.create({
        title: "User already added",
        type: "warning",
      });
      return;
    } else {
      setSelectedUser([...selectedUser, userToAdd]);
    }
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
  useEffect(() => {
    const timerId = setTimeout(() => {
      handleSearch(query);
    }, 500);
    return () => clearTimeout(timerId);
  }, [query]);

  return (
    <>
      <Box>
        <Dialog.Root
          open={openGroupDialog}
          onOpenChange={(e) => setOpenGroupDialog(!e)}
          placement={"center"}
          motionPreset="slide-in-bottom"
        >
          <Portal>
            <Dialog.Backdrop />
            <Dialog.Positioner>
              <Dialog.Content>
                <Dialog.Header>
                  <Dialog.Title> </Dialog.Title>
                </Dialog.Header>
                <Dialog.Body
                  display={"flex"}
                  flexDirection={"column"}
                  justifyContent={"center"}
                  alignItems={"center"}
                  gap={"2"}
                >
                  <Text fontSize={"xl"}>New Group Chat</Text>
                  <Input
                    placeholder="Group Name"
                    onChange={(e) => setGroupChat(e.target.value)}
                  ></Input>
                  <Input
                    placeholder="Search Users"
                    mb={3}
                    onChange={(e) => setQuery(e.target.value)}
                  ></Input>
                  <Box
                    display={"flex"}
                    flexDirection={"row"}
                    flexWrap={"wrap"}
                    gap={2}
                  >
                    {selectedUser.map((u) => (
                      <UserBadgeItem
                        key={u._id}
                        Me={user.UserName}
                        user={u}
                        handleFunction={handleDelete}
                      />
                    ))}
                  </Box>
                  {loading ? (
                    <Spinner />
                  ) : (
                    searchResult.slice(0, 4).map((user) => {
                      return (
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
                          key={user._id}
                          onClick={() => handleGroup(user)}
                        >
                          <Avatar.Root size={"md"}>
                            <Avatar.Fallback name={user.UserName} />
                            <Avatar.Image src={user.Picture} />
                          </Avatar.Root>
                          <Text key={user._id}>{user.Name}</Text>
                        </Box>
                      );
                    })
                  )}
                </Dialog.Body>
                <Dialog.Footer>
                  <Button
                    color={"white"}
                    onClick={() => setOpenGroupDialog(false)}
                  >
                    Close
                  </Button>
                  <Button bg={"white"} onClick={() => handleSubmit()}>
                    Create group
                  </Button>
                </Dialog.Footer>
                <Dialog.CloseTrigger asChild>
                  <CloseButton size="sm" />
                </Dialog.CloseTrigger>
              </Dialog.Content>
            </Dialog.Positioner>
          </Portal>
        </Dialog.Root>
      </Box>
      <GroupModalContext.Provider
        value={{ openGroupDialog, setOpenGroupDialog }}
      >
        {children}
      </GroupModalContext.Provider>
    </>
  );
};
export const GroupModalState = () => {
  return useContext(GroupModalContext);
};
export default GroupModal;
