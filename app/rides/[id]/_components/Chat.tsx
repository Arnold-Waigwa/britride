"use client";

import { useEffect, useState } from "react";
import { pusherClient } from "@/lib/pusher/pusherClient"; // Use your new client-only import
import axios from "axios";
import { Flex, Card, TextField, Button, Text, Avatar } from "@radix-ui/themes";

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
  currentUserId: number; // To differentiate your texts (right) from their texts (left)
  initialMessages: Message[]; // We can pass existing messages from safety of Prisma server component
}

export default function Chat({
  conversationId,
  currentUserId,
  initialMessages = [],
}: ChatProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages || []);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  // --- 1. SET UP PUSHER SUBSCRIPTION ---
  useEffect(() => {
    // We bind to the exact channel we made in the API route
    const channelName = `conversation-${conversationId}`;

    // Subscribe to that channel
    const channel = pusherClient.subscribe(channelName);

    // Listen for the "new-message" event
    channel.bind("new-message", (incomingMessage: Message) => {
      // Very Important: Pusher often triggers on BOTH clients (sender and receiver)
      // So we make sure to update the state with the exact incoming message format.
      setMessages((prev) => {
        // Prevent accidental duplicates in strict mode
        if (prev.some((msg) => msg.id === incomingMessage.id)) return prev;
        return [...prev, incomingMessage];
      });
    });

    // Cleanup: unsubscribe when the component unmounts
    return () => {
      pusherClient.unsubscribe(channelName);
      // Optional: you can also unbind to be very strict
      // pusherClient.unbind("new-message");
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
      style={{ height: "400px", display: "flex", flexDirection: "column" }}
    >
      {/* HEADER */}
      <Text
        weight="bold"
        size="3"
        mb="2"
        style={{ borderBottom: "1px solid #eaeaea", paddingBottom: "8px" }}
      >
        Ride Chat
      </Text>

      {/* MESSAGES LIST */}
      <Flex
        direction="column"
        gap="3"
        style={{ flex: 1, overflowY: "auto", padding: "10px 0" }}
      >
        {messages.map((msg) => {
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
        })}
      </Flex>

      {/* INPUT FORM */}
      <form onSubmit={handleSendMessage} style={{ marginTop: "10px" }}>
        <Flex gap="2">
          <TextField.Root
            style={{ flex: 1 }}
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <Button disabled={isSending || !newMessage.trim()}>Send</Button>
        </Flex>
      </form>
    </Card>
  );
}
