import React, { useState } from "react";
import { PasswordInput } from "../ui/password-input";
import { VStack, Box, Input, Button, Text, HStack } from "@chakra-ui/react";
import { toaster } from "../ui/toaster";
import axios from "axios";
import { Spinner } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { ChatState } from "@/Context/ChatProvider";

const Login = () => {
  const { token, setToken } = ChatState();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setloading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!name || !password) {
      toaster.create({
        title: "Please enter username and password",
        type: "error",
      });
      return;
    }

    try {
      setloading(true);
      const response = await axios.post("http://localhost:3000/auth/login", {
        UserName: name,
        Password: password,
      });

      if (response.data.ok) {
        toaster.create({
          title: response.data.msg,
          type: "success",
        });
        localStorage.setItem("token", response.data.token);
        setToken(response.data.token);
      } else {
        throw Error(response.data.msg);
      }
    } catch (err) {
      console.log(err);
      toaster.create({
        title: `${err}`,
        type: "error",
      });
    } finally {
      setloading(false);
    }
  };

  return (
    <VStack spacing={4} align="stretch" w="full" maxW="400px" m="1">
      <Box>
        <Text mb={1}>User Name</Text>
        <Input
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </Box>

      <Box>
        <Text mb={1}>Password</Text>
        <PasswordInput
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </Box>

      <Button colorPalette={"green"} onClick={handleLogin}>
        Log in {loading ? <Spinner /> : null}
      </Button>
    </VStack>
  );
};

export default Login;
