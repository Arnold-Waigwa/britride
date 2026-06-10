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
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Notification as NotificationModel } from "@prisma/client";

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
  const queryClient = useQueryClient();

  const { data: notifications } = useQuery<NotificationModel[]>({
    queryKey: ["notifications", userId],
    queryFn: async () =>
      await axios
        .get(`/api/notification?userId=${userId}`)
        .then((res) => res.data),
  });

  const hasAcceptedRide = notifications?.some(
    (n) => n.kind === "ACCEPTED_RIDE",
  );
  const hasMessages = notifications?.some((n) => n.kind === "MESSAGE");
  const notificationCount = notifications?.length || 0;

  useEffect(() => {
    if (!userId) return;
    //real time notifications
    const channelNotification = pusherClient.subscribe(
      messageNotificationChannel,
    );
    const channelAccepted = pusherClient.subscribe(acceptedNotificationChannel);

    console.log("subscribing to: ", userId);

    channelNotification.bind("notification", () => {
      // Instead of manual state, invalidate the query to fetch the latest from DB
      queryClient.invalidateQueries({ queryKey: ["notifications", userId] });
      toast("New message received!", { icon: "💬" });
    });

    channelAccepted.bind("accepted", () => {
      toast.success("Your ride was accepted!");
    });

    return () => {
      pusherClient.unsubscribe(messageNotificationChannel);
      pusherClient.unsubscribe(acceptedNotificationChannel);
    };
  }, [
    userId,
    messageNotificationChannel,
    acceptedNotificationChannel,
    queryClient,
  ]);

  return (
    <Popover.Root>
      <Popover.Trigger>
        <Button variant="ghost" color="gray" highContrast>
          <Box position="relative">
            {notificationCount > 0 ? (
              <MdNotificationAdd
                size="22"
                // If a ride is accepted, we use a distinct purple,
                // otherwise a softer gray-purple for messages
                color={hasAcceptedRide ? "var(--purple-9)" : "var(--purple-8)"}
              />
            ) : (
              <IoIosNotifications size="22" />
            )}
            {notificationCount > 0 && (
              <Badge
                variant="solid"
                color="red"
                radius="full"
                size="1"
                style={{ position: "absolute", top: -4, right: -8 }}
              >
                {notificationCount}
              </Badge>
            )}
          </Box>
        </Button>
      </Popover.Trigger>
      <Popover.Content width="240px">
        <Flex direction="column" gap="3">
          <Text size="2" weight="bold">
            {hasMessages && hasAcceptedRide
              ? "New messages & ride updates"
              : hasMessages
                ? "You have new messages"
                : hasAcceptedRide
                  ? "Your ride was accepted!"
                  : "No new notifications"}
          </Text>
          {notificationCount > 0 && (
            <Button size="1" asChild>
              <Link href={`/myrides/${userId}`}>View Rides</Link>
            </Button>
          )}
        </Flex>
      </Popover.Content>
    </Popover.Root>
  );
};
