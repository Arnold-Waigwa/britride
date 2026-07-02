"use client";
import {
  Avatar,
  Box,
  Button,
  Container,
  DropdownMenu,
  Flex,
  Text,
} from "@radix-ui/themes";
import { useSession } from "next-auth/react";
import { MdDarkMode, MdOutlineLightMode } from "react-icons/md";
import Link from "./components/Link";
import Notification from "./Notification";
import { useAppTheme } from "./ThemeProvider";

const Navbar = () => {
  const { data: session } = useSession();
  const { appearance, toggleTheme } = useAppTheme();

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

                <Button
                  variant="ghost"
                  color="gray"
                  onClick={toggleTheme}
                  style={{ cursor: "pointer" }}
                >
                  {appearance === "light" ? (
                    <MdDarkMode size="18" />
                  ) : (
                    <MdOutlineLightMode size="18" />
                  )}
                </Button>

                <Notification userId={session.user.id} />
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger>
                    <Button
                      variant="ghost"
                      style={{
                        cursor: "pointer",
                        padding: 0,
                        borderRadius: "50%",
                      }}
                    >
                      <Avatar
                        src={session.user.image ?? ""}
                        fallback={session.user.name?.[0] || "?"}
                        size="2"
                        radius="full"
                        referrerPolicy="no-referrer"
                      />
                    </Button>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Content
                    variant="soft"
                    align="end"
                    sideOffset={10}
                  >
                    <DropdownMenu.Label>
                      <Flex direction="column">
                        {session.user.name && (
                          <Text size="2" weight="bold">
                            {session.user.name}
                          </Text>
                        )}
                        <Text size="1" color="gray">
                          {session.user.email}
                        </Text>
                      </Flex>
                    </DropdownMenu.Label>
                    <DropdownMenu.Separator />
                    <DropdownMenu.Item color="red" asChild>
                      <Link href="/api/auth/signout">Signout</Link>
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Root>
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
