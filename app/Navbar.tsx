"use client";
import { Flex, Box, Container, Button, Text } from "@radix-ui/themes";
import { useSession } from "next-auth/react";
import Notification from "./Notification";
import Link from "./components/Link";

const Navbar = () => {
  const { data: session } = useSession();
  return (
    <Box
      position="sticky"
      top="0"
      left="0"
      right="0"
      py="4"
      style={{
        zIndex: 100,
        backdropFilter: "blur(16px) saturate(180%)",
        backgroundColor: "var(--gray-a2)",
        borderBottom: "1px solid var(--gray-a3)",
      }}
    >
      <Container size="3">
        <Flex justify="between" align="center">
          <Flex align="center" gap="2">
            {/* Signature Accent bar matching RideCard */}
            <Box
              width="4px"
              height="20px"
              className="bg-[var(--purple-9)] rounded-sm"
            />
            <Link
              href="/"
              className="font-bold text-xl tracking-tighter hover:no-underline text-[var(--gray-12)]"
            >
              BRITRIDE
            </Link>
          </Flex>

          <Flex align="center" gap="5">
            <Link
              href="/request-a-ride"
              className="text-sm font-medium transition-colors hover:text-[var(--purple-9)]"
            >
              Request a ride
            </Link>

            {session?.user ? (
              <>
                <Link
                  href={`/myrides/${session.user.id}`}
                  className="text-sm transition-colors hover:text-[var(--purple-9)]"
                >
                  My Rides
                </Link>
                <Notification userId={session.user.id} />
                <Link
                  href="/api/auth/signout"
                  className="text-sm opacity-60 hover:opacity-100 transition-opacity"
                >
                  Signout
                </Link>
              </>
            ) : (
              <Button variant="surface" color="purple" radius="full" asChild>
                <Link href="/login">Login</Link>
              </Button>
            )}
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
};

export default Navbar;
