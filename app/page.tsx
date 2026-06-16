import { Flex, Container, Heading, Text, Box } from "@radix-ui/themes";
import RideCard from "./RideCard";
import Header from "./components/Header";
import prisma from "@/prisma/client";
import SortOpenStatus from "./SortOpenStatus";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const { filter } = await searchParams;
  const rides = await prisma.ride.findMany({
    where: {
      status: filter === "OPEN" ? "OPEN" : undefined,
    },
    orderBy: { createdAt: "desc" },
  });
  return (
    <Container size="3">
      <Flex direction="column" align="center" pt="8" pb="9">
        <Flex direction="column" align="center" mb="8" gap="2">
          <Heading size="9" style={{ letterSpacing: "-0.05em" }}>
            Find your{" "}
            <span style={{ color: "var(--purple-9)" }}>next journey</span>
          </Heading>
          <Text color="gray" size="4">
            Explore available rides
          </Text>
        </Flex>

        <Flex
          justify="between"
          align="center"
          width="100%"
          mb="6"
          className="max-w-[600px]"
        >
          <Header>Latest Rides</Header>
          <SortOpenStatus />
        </Flex>

        {rides.map((ride) => (
          <RideCard
            key={ride.id}
            id={ride.id}
            title={ride.title}
            location={ride.location}
            price={ride.price}
            status={ride.status}
          />
        ))}
        {rides.length === 0 && (
          <Text size="4" style={{ color: "var(--purple-9)" }}>
            No open rides available
          </Text>
        )}
      </Flex>
    </Container>
  );
}
