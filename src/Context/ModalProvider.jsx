import React from "react";
import { useState, useEffect } from "react";
import { createContext, useContext } from "react";
import { Avatar, Box, Icon, Text, Image } from "@chakra-ui/react";
import {
  Button,
  CloseButton,
  Dialog,
  For,
  HStack,
  Portal,
} from "@chakra-ui/react";
const ModalContext = createContext();
const ModalProvider = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState();
  const [data, setData] = useState();
  useEffect(() => {
    console.log("Modal State Changed:", { open, user, data });
  }, [open, user, data]);
  return (
    <>
      <Box>
        <Dialog.Root
          open={open}
          onOpenChange={(e) => setOpen(!e)}
          placement={"center"}
          motionPreset="slide-in-bottom"
        >
          <Portal>
            <Dialog.Backdrop />
            <Dialog.Positioner>
              <Dialog.Content>
                <Dialog.Header>
                  <Dialog.Title>{data?.Title}</Dialog.Title>
                </Dialog.Header>
                <Dialog.Body
                  display={"flex"}
                  flexDirection={"column"}
                  alignItems={"center"}
                  gap={4}
                >
                  <Image
                    src={user && user.Picture}
                    boxSize="250px"
                    borderRadius="full"
                    fit="cover"
                    alt={user && user.UserName}
                  />
                  <Text fontSize={"2xl"}>{user && user.UserName}</Text>
                </Dialog.Body>
                <Dialog.Footer></Dialog.Footer>
                <Dialog.CloseTrigger asChild>
                  <CloseButton size="sm" />
                </Dialog.CloseTrigger>
              </Dialog.Content>
            </Dialog.Positioner>
          </Portal>
        </Dialog.Root>
      </Box>
      <ModalContext.Provider
        value={{ open, setOpen, user, setUser, data, setData }}
      >
        {children}
      </ModalContext.Provider>
    </>
  );
};
export const ModalState = () => {
  return useContext(ModalContext);
};
export default ModalProvider;
