import React from "react";
import { ScrollArea, Text, Box, Avatar } from "@chakra-ui/react";
import { ChatState } from "@/Context/ChatProvider";
import { useStickToBottom } from "use-stick-to-bottom";
import { LuArrowDown } from "react-icons/lu";

const ScrollableChat = ({ messages, userId }) => {
  const { user } = ChatState();
  const sticky = useStickToBottom();
  return (
    <Box
      height="100%"
      width="100%"
      bg="white"
      borderRadius="lg"
      overflow="hidden"
      p={2}
    >
      <ScrollArea.Root
        type="always"
        scrollHideDelay={600}
        style={{ height: "100%", width: "100%" }}
      >
        <ScrollArea.Viewport
          ref={sticky.scrollRef}
          style={{
            height: "100%",
            width: "100%",
            paddingRight: "10px",
            paddingBottom: "35px",
          }}
          css={{
            "--scroll-shadow-size": "4rem",
            maskImage:
              "linear-gradient(#000,#000,transparent 0,#000 var(--scroll-shadow-size),#000 calc(100% - var(--scroll-shadow-size)),transparent)",
            "&[data-at-top]": {
              maskImage:
                "linear-gradient(180deg,#000 calc(100% - var(--scroll-shadow-size)),transparent)",
            },
            "&[data-at-bottom]": {
              maskImage:
                "linear-gradient(0deg,#000 calc(100% - var(--scroll-shadow-size)),transparent)",
            },
          }}
        >
          <ScrollArea.Content ref={sticky.contentRef}>
            <Box
              width="100%"
              display="flex"
              flexDirection="column"
              gap={3}
              padding={2}
              justifyContent={"flex-end"}
            >
              {messages.map((m, index) => {
                const isSender = m.Sender._id === user.User_id; // logged-in user
                const showAvatar =
                  !isSender &&
                  (index === 0 ||
                    messages[index - 1].Sender._id !== m.Sender._id);

                return (
                  <Box
                    key={index}
                    width="100%"
                    display="flex"
                    gap={2}
                    justifyContent={isSender ? "flex-end" : "flex-start"}
                  >
                    {/* SHOW AVATAR ONLY FOR OTHER USERS */}
                    {!isSender && (
                      <>
                        {showAvatar ? (
                          <Avatar.Root>
                            <Avatar.Fallback name={m.Sender.Name} />
                            <Avatar.Image src={m.Sender.Picture} />
                          </Avatar.Root>
                        ) : (
                          <Box width="40px" /> // keep alignment tidy
                        )}
                      </>
                    )}

                    {/* MESSAGE BUBBLE */}
                    <Box
                      bg={isSender ? "#D2E8FF" : "#E6FFDA"} // blue for me, green for others
                      borderRadius="md"
                      p={2}
                      maxWidth="75%"
                      wordBreak="break-word"
                      alignSelf={isSender ? "flex-end" : "flex-start"}
                      display={"flex"}
                      flexDirection={"column"}
                    >
                      <h3 style={{ color: "gray", fontWeight: "bold" }}>
                        {!isSender && showAvatar ? m.Sender.Name : null}
                      </h3>
                      <Text color="black">{m.Content}</Text>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </ScrollArea.Content>
        </ScrollArea.Viewport>

        <ScrollArea.Scrollbar orientation="vertical" style={{ width: "10px" }}>
          <ScrollArea.Thumb
            style={{
              backgroundColor: "#a0aec0",
              borderRadius: "8px",
            }}
          />
        </ScrollArea.Scrollbar>

        <ScrollArea.Corner />
      </ScrollArea.Root>
    </Box>
  );
};

export default ScrollableChat;
