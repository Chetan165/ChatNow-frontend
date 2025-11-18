import { Box, CloseButton } from "@chakra-ui/react";
import React from "react";

const UserBadgeItem = ({ user, handleFunction }) => {
  return (
    <Box
      px={2}
      py={1}
      borderRadius={"lg"}
      m={1}
      mb={1}
      variant={"solid"}
      fontSize={12}
      bg={"purple"}
      color={"white"}
      cursor={"pointer"}
      onClick={() => handleFunction(user)}
    >
      {user.Name}
      <CloseButton margin={1} />
    </Box>
  );
};

export default UserBadgeItem;
