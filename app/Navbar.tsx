"use client";
import { Flex } from "@radix-ui/themes";
import { useSession } from "next-auth/react";
import Link from "./components/Link";

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
