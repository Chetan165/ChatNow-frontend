import {
  Box,
  Button,
  Menu,
  Text,
  Portal,
  Icon,
  Avatar,
  CloseButton,
  Drawer,
  Input,
  VStack,
  Spinner,
  HStack,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  Stack,
} from "@chakra-ui/react";
import axios from "axios";
import { Tooltip } from "../ui/tooltip";
import { toaster } from "../ui/toaster";
import React, { useState } from "react";
import { ChatState } from "@/Context/ChatProvider";
import { ModalState } from "@/Context/ModalProvider";
import { useNavigate } from "react-router-dom";
const SideDrawer = () => {
  const navigate = useNavigate();
  let { open, setOpen, setUser, setData } = ModalState();
  const {
    user,
    setToken,
    token,
    selectedChat,
    setSelectedChat,
    chats,
    setChats,
  } = ChatState();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [search, setSearch] = useState("");
  const [searchresult, setSearchresult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setloadingChat] = useState(false);
  const acessChat = async (userId, UserName) => {
    try {
      setloadingChat(true);
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.post(
        "http://localhost:3000/chat/access",
        { _id: userId, UserName },
        config
      );
      console.log(data.chat);
      if (data.chat && !chats?.find((c) => c._id === data.chat._id)) {
        setChats([data.chat, ...[chats ? chats : null]]);
      }
      setSelectedChat(data.chat);
      console.log(data);
      setOpenDrawer(!openDrawer);
    } catch (err) {
      console.log(err);
      toaster.create({
        title: "Error Occurred!",
        description: "Failed to Load the chats",
        type: "error",
      });
    } finally {
      setloadingChat(false);
    }
  };
  const handleSearch = async () => {
    if (!search) {
      toaster.create({
        title: "Please enter something in search",
        type: "warning",
      });
      return;
    }
    try {
      setLoading(true);
      const data = await axios.get(
        `http://localhost:3000/api/user?search=${search}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSearchresult(data.data.users);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        bg={"white"}
        w={"100%"}
        p={"5px 10px 5px 10px"}
        borderWidth={"3px"}
      >
        <Tooltip
          showArrow
          content="Click to search users"
          positioning={{ placement: "bottom-end" }}
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setOpenDrawer(!openDrawer)}
          >
            <i class="fas fa-search"></i>
            <Text display={{ base: "none", md: "flex" }} px={4}>
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Text
          fontSize={"2xl"}
          fontFamily={"Work Sans"}
          color={"black"}
          padding={"1"}
        >
          ChatNow
        </Text>
        <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
          <Menu.Root>
            <Menu.Trigger asChild>
              <Button variant="outline" size="sm">
                <Icon border={"1px"}>
                  <i class="fa-regular fa-bell"></i>
                </Icon>
              </Button>
            </Menu.Trigger>
            <Portal>
              <Menu.Positioner>
                <Menu.Content>
                  <Menu.Item value="new-txt">New Text File</Menu.Item>
                  <Menu.Item value="new-file">New File...</Menu.Item>
                  <Menu.Item value="new-win">New Window</Menu.Item>
                  <Menu.Item value="open-file">Open File...</Menu.Item>
                  <Menu.Item value="export">Export</Menu.Item>
                </Menu.Content>
              </Menu.Positioner>
            </Portal>
          </Menu.Root>
          <Menu.Root positioning={{ placement: "bottom-end" }}>
            <Menu.Trigger asChild>
              <Button
                variant="outline"
                size="md"
                padding={"3"}
                paddingTop={"5"}
                paddingBottom={"5"}
                bg={"transparent"}
              >
                <Avatar.Root size={"md"}>
                  <Avatar.Fallback name={user.UserName} />
                  <Avatar.Image src={user.Picture} />
                </Avatar.Root>
                <i class="fa-solid fa-chevron-down"></i>
              </Button>
            </Menu.Trigger>
            <Portal>
              <Menu.Positioner>
                <Menu.Content>
                  <Menu.Item
                    value="new-txt"
                    onClick={() => {
                      setOpen(!open);
                      setUser(user);
                      setData({
                        Title: "My Profile",
                        Picture: user.Picture,
                      });
                    }}
                  >
                    My Profile
                  </Menu.Item>
                  <Menu.Item
                    value="new-txt"
                    onClick={() => {
                      localStorage.removeItem("token");
                      setToken("");
                      navigate("/");
                    }}
                  >
                    Logout
                  </Menu.Item>
                </Menu.Content>
              </Menu.Positioner>
            </Portal>
          </Menu.Root>
        </div>
      </Box>
      <Drawer.Root open={openDrawer} placement={"left"}>
        <Portal>
          <Drawer.Backdrop />
          <Drawer.Positioner>
            <Drawer.Content>
              <Drawer.Header>
                <Drawer.Title>Drawer Title</Drawer.Title>
              </Drawer.Header>
              <Drawer.Body>
                <Box display={"flex"} gap={"2"} margin={"3"}>
                  <Input
                    type="text"
                    placeholder="Search by Name"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  ></Input>
                  <Button
                    bg={"white"}
                    onClick={() => {
                      handleSearch();
                    }}
                  >
                    Go
                  </Button>
                </Box>

                {loading ? (
                  <Stack gap="6" maxW="xs">
                    <HStack width="full">
                      <SkeletonCircle size="10" />
                      <SkeletonText noOfLines={2} />
                    </HStack>
                    <Skeleton height="50px" />
                  </Stack>
                ) : (
                  <Box>
                    {searchresult?.map((user) => (
                      <div
                        key={user.Name}
                        onClick={() => acessChat(user._id, user.Name)}
                      >
                        <Text
                          key={user._id}
                          padding={"2"}
                          display={"flex"}
                          justifyContent={"space-between"}
                          alignItems={"center"}
                          borderRadius={"5px"}
                          marginRight={"5"}
                          width={"80%"}
                          mb={"2"}
                          fontSize={"md"}
                          cursor={"pointer"}
                          _hover={{ background: "#38B2AC", color: "white" }}
                        >
                          {user.Name}
                          <Avatar.Root size={"md"}>
                            <Avatar.Fallback name={user.UserName} />
                            <Avatar.Image src={user.Picture} />
                          </Avatar.Root>
                        </Text>
                      </div>
                    ))}
                  </Box>
                )}
                {loadingChat && <Spinner ml={"auto"} display={"block"} />}
              </Drawer.Body>
              <Drawer.Footer></Drawer.Footer>
              <Drawer.CloseTrigger asChild>
                <CloseButton
                  size="sm"
                  onClick={() => setOpenDrawer(!openDrawer)}
                />
              </Drawer.CloseTrigger>
            </Drawer.Content>
          </Drawer.Positioner>
        </Portal>
      </Drawer.Root>
    </>
  );
};

export default SideDrawer;
