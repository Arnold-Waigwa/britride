import { notFound } from "next/navigation";
import prisma from "@/prisma/client";
import { getServerSession } from "next-auth";
import authOptions from "@/app/auth";
import {
  Text,
  Grid,
  Flex,
  Card,
  Heading,
  Badge,
  Box,
  Button,
} from "@radix-ui/themes";
import ReactMarkDown from "react-markdown";
import Link from "next/link";
import Delete from "../_components/Delete";
import Accept from "../_components/Accept";
import Chat from "./_components/Chat";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  // 1. Fetch current logged-in user
  const session = await getServerSession(authOptions);

  // 2. Fetch the ride AND its conversation + messages
  const ride = await prisma.ride.findUnique({
    where: { id: parseInt(id) },
    include: {
      conversation: {
        include: {
          messages: {
            include: {
              sender: true,
            },
            orderBy: {
              createdAt: "asc",
            },
          },
        },
      },
    },
  });

  if (!ride) return notFound();

  const isPoster = ride.posterId === Number(session?.user.id);

  return (
    <Grid columns={{ initial: "1", md: "5" }} gap="6" mt="6">
      {/* LEFT COLUMN: Main content occupies 4 of the 5 columns on desktop */}
      <Box className="md:col-span-3">
        <Heading size="8" weight="bold" mb="2">
          {ride.title}
        </Heading>

        <Flex gap="3" align="center" mb="6">
          <Badge color={ride.status === "OPEN" ? "green" : "ruby"}>
            {ride.status}
          </Badge>
          <Text color="gray" size="2">
            Posted on {ride.createdAt.toLocaleDateString()}
          </Text>
          <Text color="gray" size="2">
            <span role="img" aria-label="location">
              📍
            </span>{" "}
            {ride.location}
          </Text>
        </Flex>

        <Card variant="surface" size="3" className="prose max-w-full">
          <ReactMarkDown>{ride.description}</ReactMarkDown>
        </Card>

        {session?.user && ride.conversation && (
          <Box mt="9">
            <Heading size="5" mb="4">
              Conversation
            </Heading>
            <Chat
              conversationId={ride.conversation.id}
              currentUserId={parseInt(session.user.id)}
              // Prisma Date objects to string if passing from Server to Client component
              initialMessages={ride.conversation.messages?.map((msg) => ({
                ...msg,
                createdAt: msg.createdAt.toISOString(),
              }))}
            />
          </Box>
        )}
      </Box>

      {/* RIGHT COLUMN (Sidebar & Chat) */}
      <Box className="md:col-span-2">
        <Flex direction="column" gap="5">
          <Card size="4">
            <Flex direction="column" gap="4">
              <Heading size="4">Trip Details</Heading>
              <Flex justify="between" align="center">
                <Text size="3" color="gray">
                  Trip Price
                </Text>
                <Text size="6" weight="bold">
                  ${ride.price}
                </Text>
              </Flex>
              {!isPoster && <Accept id={ride.id} />}
              {isPoster && (
                <Flex direction="column" gap="3" mt="2">
                  <Button asChild variant="soft" color="gray" size="3">
                    <Link href={`/rides/${ride.id}/edit`}>Edit Ride</Link>
                  </Button>
                  <Delete id={ride.id} />
                </Flex>
              )}
            </Flex>
          </Card>
        </Flex>
      </Box>
    </Grid>
  );
};

export default page;
