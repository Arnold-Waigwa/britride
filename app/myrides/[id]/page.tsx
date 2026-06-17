import Header from "@/app/components/Header";
import RideCard from "@/app/RideCard";
import prisma from "@/prisma/client";
import { Box, Container, Flex, Heading, Text } from "@radix-ui/themes";
import { notFound } from "next/navigation";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id: Number(id) },
    include: {
      postedRides: {
        orderBy: { createdAt: "desc" },
      },
      acceptedRides: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!user) notFound();

  return (
    <Container size="3">
      <Flex direction="column" align="center" pt="8" pb="9">
        {/* Page Header */}
        <Flex direction="column" align="center" mb="8" gap="2">
          <Heading size="9" style={{ letterSpacing: "-0.05em" }}>
            My <span style={{ color: "var(--purple-9)" }}>Journeys</span>
          </Heading>
          <Text color="gray" size="4">
            Manage the rides you've created or accepted
          </Text>
        </Flex>

        {/* Posted Rides Section */}
        <Box width="100%" mb="8" className="max-w-[600px]">
          <Header>Posted by me</Header>
          <Box mt="4">
            {user.postedRides.length > 0 ? (
              user.postedRides.map((ride) => (
                <RideCard
                  key={ride.id}
                  id={ride.id}
                  location={ride.location}
                  price={ride.price}
                  title={ride.title}
                  status={ride.status}
                />
              ))
            ) : (
              <Text color="gray" size="2">
                You haven't posted any rides yet.
              </Text>
            )}
          </Box>
        </Box>

        {/* Accepted Rides Section */}
        <Box width="100%" className="max-w-[600px]">
          <Header>Rides I've Accepted</Header>
          <Box mt="4">
            {user.acceptedRides.length > 0 ? (
              user.acceptedRides.map((ride) => (
                <RideCard
                  key={ride.id}
                  id={ride.id}
                  location={ride.location}
                  price={ride.price}
                  title={ride.title}
                  status={ride.status}
                />
              ))
            ) : (
              <Text color="gray" size="2">
                You haven't accepted any rides yet.
              </Text>
            )}
          </Box>
        </Box>
      </Flex>
    </Container>
  );
};

export default page;
