import React, { useEffect } from "react";
import { useState } from "react";
import { Box, IconButton, Input, Spinner, Text } from "@chakra-ui/react";
import { ChatState } from "@/Context/ChatProvider";
import UpdateGroupChatModal from "./UpdateGroupChatModal";
import axios from "axios";
import "./styles.css";
import ScrollableChat from "./ScrollableChat";
import { io } from "socket.io-client";
import Lottie from "react-lottie";
import animationData from "../../animations/typing.json";

const defaultopts = {
  loop: true,
  autoplay: true,
  animationData: animationData,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

const Endpoint = "http://localhost:3000";
let socket, selectedChatCompare;
const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat, token, chats, setChats } =
    ChatState();
  const [socketConnected, setSocketConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openUpdateGroupDialog, setOpenUpdateGroupDialog] = useState(false);
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [message, setMessage] = useState("");

  const loadMessages = async () => {
    console.log("Loading Messages");
    try {
      setLoading(true);
      const { data } = await axios.get(
        `http://localhost:3000/message/${selectedChat._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data.ok) {
        console.log(data.messages);
        setMessages(data.messages);
        socket.emit("join chat", selectedChat._id);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  const sendMessage = async (event) => {
    if (event.key === "Enter" && message.trim() !== "") {
      try {
        const { data } = await axios.post(
          `http://localhost:3000/message/send`,
          {
            content: message,
            chatId: selectedChat._id,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!data.ok) {
          throw Error("Error sending message");
        } else {
          socket.emit("new message", data.message);
          let temp = [...messages];
          temp.push(data.message);
          setMessages(temp);
          setMessage("");
        }
      } catch (err) {
        console.log(err);
      }
    }
  };
  useEffect(() => {
    console.log("attempting socket connection");
    socket = io(Endpoint);
    socket.emit("setup", user);
    socket.on("connected", () => {
      setSocketConnected(true);
    });
    socket.on("typing", () => {
      setIsTyping(true);
    });
    socket.on("stop typing", () => {
      setIsTyping(false);
    });
  }, []);
  useEffect(() => {
    loadMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);
  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageRecieved.Chat._id
      ) {
        //send notification
        setFetchAgain(!fetchAgain);
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });
  useEffect(() => {
    console.log(messages);
  }, [messages]);
  const typingHandler = (e) => {
    setMessage(e.target.value);

    if (!socketConnected) return;
    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

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
                {user.User_id === selectedChat.groupAdmin._id ? (
                  <IconButton
                    color={"white"}
                    onClick={() => setOpenUpdateGroupDialog(true)}
                  >
                    <i class="fas fa-edit"></i>
                  </IconButton>
                ) : (
                  <></>
                )}
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
            alignItems={"center"}
            justifyContent={"flex-end"}
            padding={1}
            overflow={"hidden"}
            width={"100%"}
            flex={1}
            overflowY={"hidden"}
            bg={"#E8E8E8"}
            borderRadius={"lg"}
          >
            {loading ? (
              <Spinner color={"black"} />
            ) : (
              <div className="messages" style={{ width: "100%" }}>
                <ScrollableChat messages={messages}>scroll</ScrollableChat>
                {isTyping && !typing ? (
                  <Lottie
                    options={defaultopts}
                    height={40}
                    width={60}
                    style={{
                      marginLeft: "10px",
                      marginTop: "-10px",
                      marginBottom: "-5px",
                      transform: "scale(0.8)",
                      transformOrigin: "left center",
                      opacity: 0.85,
                    }}
                  />
                ) : null}
              </div>
            )}
            <UpdateGroupChatModal
              fetchAgain={fetchAgain}
              setFetchAgain={setFetchAgain}
              openUpdateGroupDialog={openUpdateGroupDialog}
              setOpenUpdateGroupDialog={setOpenUpdateGroupDialog}
              loadMessages={loadMessages}
            />

            <Input
              color={"black"}
              placeholder="Enter a Message"
              required={true}
              bg={"white"}
              borderRadius={"sm"}
              width={"100%"}
              margin={3}
              minHeight={"40px"}
              maxHeight={"45px"}
              value={message}
              onChange={(e) => typingHandler(e)}
              onKeyDown={(e) => sendMessage(e)}
            ></Input>
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
