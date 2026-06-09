"use client";
import { Badge, Box, Button, Flex, Popover, Text } from "@radix-ui/themes";
import { useSession } from "next-auth/react";
import Link from "./components/Link";
import { useEffect, useState } from "react";
import { pusherClient } from "@/lib/pusher/pusherClient";
import { IoIosNotifications } from "react-icons/io";
import { MdNotificationAdd } from "react-icons/md";
import { toast } from "react-hot-toast";
import axios from "axios";

const Navbar = () => {
  const { data: session } = useSession();
  return (
    <Flex justify="between" mb="4">
      <Link href="/">Home</Link>
      <Flex justify="end" className="mt-2 gap-13 ">
        <Link href="/request-a-ride">Request a ride</Link>
        {session?.user ? (
          <>
            <Link href={`/myrides/${session.user.id}`}>My Rides</Link>
            <Notification userId={session.user.id} />
            <Link href="/api/auth/signout">Signout</Link>
          </>
        ) : (
          <Link href="/login">Login</Link>
        )}
      </Flex>
    </Flex>
  );
};

export default Navbar;

type NotificationProps = {
  userId: string | number;
};

const Notification = ({ userId }: NotificationProps) => {
  const messageNotificationChannel = `user-${userId}`;
  const acceptedNotificationChannel = `accepted-${userId}`;
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!userId) return;

    const channelNotification = pusherClient.subscribe(
      messageNotificationChannel,
    );
    const channelAccepted = pusherClient.subscribe(acceptedNotificationChannel);

    console.log("subscribing to: ", userId);

    channelNotification.bind("notification", () => {
      setUnreadCount((prev) => prev + 1);
    });

    channelAccepted.bind("accepted", () => {
      toast.success("Your ride was accepted!");
    });

    return () => {
      pusherClient.unsubscribe(messageNotificationChannel);
      pusherClient.unsubscribe(acceptedNotificationChannel);
    };
  }, [userId, messageNotificationChannel, acceptedNotificationChannel]);

  return (
    <Popover.Root>
      <Popover.Trigger>
        <Button variant="ghost" color="gray" highContrast>
          <Box position="relative">
            {unreadCount > 0 ? (
              <MdNotificationAdd size="22" color="var(--purple-9)" />
            ) : (
              <IoIosNotifications size="22" />
            )}
            {unreadCount > 0 && (
              <Badge
                variant="solid"
                color="red"
                radius="full"
                size="1"
                style={{ position: "absolute", top: -4, right: -8 }}
              >
                {unreadCount}
              </Badge>
            )}
          </Box>
        </Button>
      </Popover.Trigger>
      <Popover.Content width="240px">
        <Flex direction="column" gap="3">
          <Text size="2" weight="bold">
            {unreadCount > 0 ? "You have new messages" : "No new notifications"}
          </Text>
          {unreadCount > 0 && (
            <Button size="1" onClick={() => setUnreadCount(0)}>
              <Link href={`/myrides/${userId}`}>View Rides</Link>
            </Button>
          )}
        </Flex>
      </Popover.Content>
    </Popover.Root>
  );
};
