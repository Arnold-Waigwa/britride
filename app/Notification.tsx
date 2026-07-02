import { getPusherClient } from "@/lib/pusher/pusherClient";
import {
  Badge,
  Box,
  Button,
  Flex,
  Link,
  Popover,
  Text,
} from "@radix-ui/themes";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { IoIosNotifications } from "react-icons/io";
import { MdNotificationAdd } from "react-icons/md";
import { Notification as NotificationModel } from "@prisma/client";

type NotificationProps = {
  userId: string | number;
};

const Notification = ({ userId }: NotificationProps) => {
  const messageNotificationChannel = `user-${userId}`;
  const acceptedNotificationChannel = `accepted-${userId}`;
  const queryClient = useQueryClient();
  const [snapshot, setSnapshot] = useState<NotificationModel[]>([]);

  const { data: notifications } = useQuery<NotificationModel[]>({
    queryKey: ["notifications", userId],
    queryFn: async () =>
      await axios
        .get(`/api/notification?userId=${userId}`)
        .then((res) => res.data),
  });

  const { mutate: clearNotifications } = useMutation({
    mutationFn: async () =>
      await axios.delete(`/api/notification?userId=${userId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications", userId] });
    },
  });

  const notificationCount = notifications?.length || 0;
  const hasAcceptedRide = notifications?.some(
    (n) => n.kind === "ACCEPTED_RIDE",
  );

  // Capture notifications in a snapshot so they remain visible in the popover
  // even after the live data is cleared from the database.
  useEffect(() => {
    if (notifications && notifications.length > 0) {
      setSnapshot(notifications);
    }
  }, [notifications]);

  const hasSnapshotAccepted = snapshot.some((n) => n.kind === "ACCEPTED_RIDE");
  const hasSnapshotMessages = snapshot.some((n) => n.kind === "MESSAGE");

  useEffect(() => {
    if (!userId) return;
    //real time notifications
    const pusherClient = getPusherClient();
    const channelNotification = pusherClient.subscribe(
      messageNotificationChannel,
    );
    const channelAccepted = pusherClient.subscribe(acceptedNotificationChannel);

    console.log("subscribing to: ", userId);

    channelNotification.bind("notification", () => {
      // Instead of manual state, invalidate the query to fetch the latest from DB
      queryClient.invalidateQueries({ queryKey: ["notifications", userId] });
      toast("New message received!", { icon: "💬", id: "new-message" });
    });

    channelAccepted.bind("accepted", () => {
      toast.success("Your ride was accepted!", { id: "ride-accepted" });
    });

    return () => {
      channelNotification.unbind("notification");
      channelAccepted.unbind("accepted");
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
    <Popover.Root
      onOpenChange={(open) => {
        // Clear from DB and reset badge count when opened
        if (open && notificationCount > 0) clearNotifications();
        // Clear the snapshot only when the popover is closed
        if (!open) setSnapshot([]);
      }}
    >
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
            {hasSnapshotMessages && hasSnapshotAccepted
              ? "New messages & ride updates"
              : hasSnapshotMessages
                ? "You have new messages"
                : hasSnapshotAccepted
                  ? "Your ride was accepted!"
                  : "No new notifications"}
          </Text>
          {snapshot.length > 0 && (
            <Popover.Close>
              <Button size="1" asChild>
                <Link href={`/myrides/${userId}`}>View Rides</Link>
              </Button>
            </Popover.Close>
          )}
        </Flex>
      </Popover.Content>
    </Popover.Root>
  );
};

export default Notification;
