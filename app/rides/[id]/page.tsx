import { notFound } from "next/navigation";
import prisma from "@/prisma/client";
import { Text, Grid, Flex, Card, Heading, Badge, Box } from "@radix-ui/themes";
import ReactMarkDown from "react-markdown";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const ride = await prisma.ride.findUnique({
    where: { id: parseInt(id) },
  });

  if (!ride) {
    notFound(); // Built in Next.js 404 handler!
  }

  return (
    <Grid columns={{ initial: "1", sm: "5" }} gap="5">
      {/* LEFT COLUMN: Main content occupies 4 of the 5 columns on desktop */}
      <Box className="md:col-span-4">
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
      </Box>

      {/* RIGHT COLUMN: Sidebar (price & future buttons) */}
      <Box>
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
            {/* Future placement for Edit/Accept buttons */}
          </Flex>
        </Card>
      </Box>
    </Grid>
  );
};

export default page;
