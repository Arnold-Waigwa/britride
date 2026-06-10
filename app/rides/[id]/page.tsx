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

  return (
    <Grid columns={{ initial: "1", sm: "5" }} gap="5" className="mt-5">
      {/* LEFT COLUMN: Main content occupies 4 of the 5 columns on desktop */}
      <Box className="md:col-span-3 mr-20">
        <Heading size="8" mb="2">
          {ride.title}
        </Heading>

        <Flex gap="3" align="center" mb="5">
          <Badge color={ride.status === "OPEN" ? "green" : "ruby"}>
            {ride.status}
          </Badge>
          <Text color="gray" size="2">
            {ride.createdAt.toDateString()}
          </Text>
          <Text color="gray" size="2">
            📍 {ride.location}
          </Text>
        </Flex>

        <Card variant="surface" className="prose max-w-full">
          <ReactMarkDown>{ride.description}</ReactMarkDown>
        </Card>
        {session?.user && ride.conversation && (
          <Chat
            conversationId={ride.conversation.id}
            currentUserId={parseInt(session.user.id)}
            // Prisma Date objects to string if passing from Server to Client component
            initialMessages={ride.conversation.messages?.map((msg) => ({
              ...msg,
              createdAt: msg.createdAt.toISOString(),
            }))}
          />
        )}
      </Box>
      {/* RIGHT COLUMN (Sidebar & Chat) */}
      <Box className="md:col-span-2">
        <Flex direction="column" gap="5">
          <Card>
            <Flex direction="column" gap="4">
              <Heading size="4">Details</Heading>
              <Flex justify="between" align="center">
                <Text size="3" color="gray">
                  Price
                </Text>
                <Text size="5" weight="bold">
                  ${ride.price}
                </Text>
              </Flex>
              <Accept id={ride.id} />
              <Button asChild>
                <Link href={`/rides/${ride.id}/edit`}>Edit</Link>
              </Button>
              <Delete id={ride.id} />
            </Flex>
          </Card>
        </Flex>
      </Box>
    </Grid>
  );
};

export default page;
