"use client";

import { useEffect, useState } from "react";
import { pusherClient } from "@/lib/pusher/pusherClient";
import axios from "axios";
import { Flex, Card, TextField, Button, Text, Avatar } from "@radix-ui/themes";
import { PaperPlaneIcon } from "@radix-ui/react-icons";

interface Message {
  id: number;
  content: string;
  senderId: number;
  createdAt: string;
  sender: {
    name: string | null;
    image: string | null;
  };
}

interface ChatProps {
  conversationId: number;
  currentUserId: number;
  initialMessages: Message[];
}

export default function Chat({
  conversationId,
  currentUserId,
  initialMessages = [],
}: ChatProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages || []);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const channelName = `private-conversation-${conversationId}`;

    const channel = pusherClient.subscribe(channelName);

    // Listen for the "new-message" event
    channel.bind("new-message", (incomingMessage: Message) => {
      setMessages((prev) => {
        // Prevent accidental duplicates in strict mode
        if (prev.some((msg) => msg.id === incomingMessage.id)) return prev;
        return [...prev, incomingMessage];
      });
    });

    // Cleanup: unsubscribe when the component unmounts
    return () => {
      pusherClient.unsubscribe(channelName);
    };
  }, [conversationId]);

  // --- 2. SEND MESSAGE ACTION ---
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      setIsSending(true);
      // Let the backend persist it and trigger pusher
      await axios.post("/api/messages", {
        conversationId,
        content: newMessage,
      });

      // Clear the box for next message
      setNewMessage("");
    } catch (error) {
      console.error("Failed to send message", error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Card
      size="2"
      mt="2"
      style={{ height: "400px", display: "flex", flexDirection: "column" }}
    >
      <Text
        weight="bold"
        size="3"
        mb="2"
        style={{ borderBottom: "1px solid #eaeaea", paddingBottom: "8px" }}
      >
        Ride Chat
      </Text>

      <Flex
        direction="column"
        gap="3"
        style={{ flex: 1, overflowY: "auto", padding: "10px 0" }}
      >
        {messages.length === 0 ? (
          <Text align="center" color="gray" highContrast>
            Start the conversation!
          </Text>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderId === currentUserId;
            return (
              <Flex
                key={msg.id}
                gap="2"
                justify={isMe ? "end" : "start"}
                align="end"
              >
                {!isMe && (
                  <Avatar
                    size="1"
                    fallback={msg.sender.name![0]}
                    src={msg.sender.image!}
                    radius="full"
                  />
                )}

                <div
                  style={{
                    backgroundColor: isMe ? "var(--accent-9)" : "var(--gray-3)",
                    color: isMe ? "white" : "inherit",
                    padding: "8px 12px",
                    borderRadius: "16px",
                    borderBottomRightRadius: isMe ? "0px" : "16px",
                    borderBottomLeftRadius: !isMe ? "0px" : "16px",
                    maxWidth: "80%",
                  }}
                >
                  <Text size="2">{msg.content}</Text>
                </div>
              </Flex>
            );
          })
        )}
      </Flex>

      <form onSubmit={handleSendMessage} style={{ marginTop: "10px" }}>
        <Flex gap="2">
          <TextField.Root
            style={{ flex: 1 }}
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <Button disabled={isSending || !newMessage.trim()}>
            <PaperPlaneIcon />
          </Button>
        </Flex>
      </form>
    </Card>
  );
}
