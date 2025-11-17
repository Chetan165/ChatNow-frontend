import React, { useState } from "react";
import axios from "axios";
import { useMemo } from "react";
import { VStack, Box, Input, Button, Text, HStack } from "@chakra-ui/react";
import {
  PasswordInput,
  PasswordStrengthMeter,
} from "@/components/ui/password-input";
import { passwordStrength } from "check-password-strength";
import { Alert } from "@chakra-ui/react";
import { toaster } from "../ui/toaster";
import { Spinner } from "@chakra-ui/react";

const strengthOptions = [
  { id: 1, value: "weak", minDiversity: 0, minLength: 0 },
  { id: 2, value: "medium", minDiversity: 2, minLength: 6 },
  { id: 3, value: "strong", minDiversity: 3, minLength: 8 },
  { id: 4, value: "very-strong", minDiversity: 4, minLength: 10 },
];

const Signup = () => {
  const [loading, setloading] = useState(false);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pic, setPic] = useState(null);
  const [toggle, setToggle] = useState(0);

  const strength = useMemo(() => {
    if (!password) return 0;
    const result = passwordStrength(password, strengthOptions);
    return result.id;
  }, [password]);
  const handleSignup = async () => {
    if (confirmPassword != password) {
      toaster.create({
        title: `Confirm Password and Password should match`,
        type: "error",
      });
    } else {
      try {
        const formdata = new FormData();
        formdata.append("file", pic);
        formdata.append("UserName", name);
        formdata.append("Password", password);
        formdata.append("fileid", name);
        setloading(true);
        if (!pic) {
          toaster.create({
            title: `${"No Picture provided, default will be used"}`,
            type: "warning",
          });
        }
        const response = await axios.post(
          "http://localhost:3000/auth/register",
          formdata
        );

        if (response.data.ok) {
          toaster.create({
            title: `${response.data.msg}`,
            type: "success",
          });
        } else {
          throw Error(response.data.msg);
        }
      } catch (err) {
        toaster.create({
          title: `${err.message}`,
          type: "error",
        });
      } finally {
        setloading(false);
      }
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
        <PasswordStrengthMeter value={strength} />
      </Box>

      <Box>
        <Text mb={1}>Confirm Password</Text>
        <PasswordInput
          type="password"
          placeholder="Confirm password"
          value={confirmPassword}
          onFocus={() => setToggle(!toggle)}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        {confirmPassword != password && toggle ? (
          <Alert.Root status="error" size={"sm"}>
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Title>Password Mismatch</Alert.Title>
              <Alert.Description>
                Password & Confirm Password should be same
              </Alert.Description>
            </Alert.Content>
          </Alert.Root>
        ) : null}
      </Box>

      <Box>
        <Text mb={1}>Picture</Text>
        <Input
          border={"transparent"}
          type="file"
          onChange={(e) => {
            setPic(e.target.files[0]);
          }}
        />
      </Box>

      <Button colorPalette={"green"} onClick={handleSignup}>
        Sign Up {loading ? <Spinner /> : null}
      </Button>
    </VStack>
  );
};

export default Signup;
