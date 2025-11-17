import React, { useContext, useEffect } from "react";
import { Box, Container, Text } from "@chakra-ui/react";
import { Tabs, Tab, TabList, TabPanel, TabPanels } from "@chakra-ui/tabs";
import { useNavigate } from "react-router-dom";
import Login from "../components/Authentication/Login";
import Signup from "../components/Authentication/Signup";
function Homepage() {
  return (
    <Container maxW="xl" centerContent color={"black"}>
      <Box
        display="flex"
        justifyContent="center"
        p={3}
        bg="white"
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
      >
        <Text fontSize="4xl" fontFamily={"Work Sans"}>
          ChatNow
        </Text>
      </Box>
      <Box
        bg="white"
        w="100%"
        p={4}
        borderRadius="lg"
        borderWidth="1px"
        paddingLeft={"10"}
      >
        <Tabs isFitted variant="soft-rounded" margin={4} padding={3}>
          <TabList mb="1em" color={"White"}>
            <Tab margin={4}>Login</Tab>
            <Tab margin={4}>Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
}

export default Homepage;
