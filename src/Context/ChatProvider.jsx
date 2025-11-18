import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ChatContext = createContext();
const ChatProvider = ({ children }) => {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState();
  const [selectedChat, setSelectedChat] = useState();
  const [chats, setChats] = useState([]);
  const [openGroupDialog, setOpenGroupDialog] = useState(false);
  const Userauth = async () => {
    try {
      const res = await axios.get("http://localhost:3000/auth/", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log(res);
      if (!res.data.ok) {
        navigate("/");
      } else {
        setUser(res.data.user);
        console.log("User Authenticated navigating to /chats");
        navigate("/chats");
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    Userauth();
  }, [token]);
  return (
    <ChatContext.Provider
      value={{
        user,
        setUser,
        setToken,
        token,
        selectedChat,
        setSelectedChat,
        chats,
        setChats,
        openGroupDialog,
        setOpenGroupDialog,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
