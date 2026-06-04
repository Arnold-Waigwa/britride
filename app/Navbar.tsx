"use client";
import { Button, Flex, Popover, Text } from "@radix-ui/themes";
import { useSession } from "next-auth/react";
import Link from "./components/Link";
import { useEffect, useState } from "react";
import { pusherClient } from "@/lib/pusher/pusherClient";
import { IoIosNotifications } from "react-icons/io";
import { MdNotificationAdd } from "react-icons/md";

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
  userId: string;
};

const Notification = ({ userId }: NotificationProps) => {
  const channelName = `user-${userId}`;
  const [haveNotifications, setHaveNotifications] = useState(false);
  useEffect(() => {
    //subscribe to a notification channel
    const channel = pusherClient.subscribe(channelName);
    //bind to the channel to listen to incoming notifications
    channel.bind("notification", () => {
      setHaveNotifications(true);
    });
    return () => {
      pusherClient.unsubscribe(channelName);
      pusherClient.unbind("notification");
    };
  }, []);

  return (
    <>
      {haveNotifications ? (
        <Popover.Root>
          <Popover.Trigger>
            <Button variant="soft" onClick={() => setHaveNotifications(false)}>
              <MdNotificationAdd />
            </Button>
          </Popover.Trigger>
          <Popover.Content>
            <Text as="p" trim="both" size="1">
              You have new notifications
            </Text>
          </Popover.Content>
        </Popover.Root>
      ) : (
        <IoIosNotifications />
      )}
    </>
  );
};
