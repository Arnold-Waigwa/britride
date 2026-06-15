import { Flex } from "@radix-ui/themes";
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
    <div>
      <Flex direction="column" justify="center" align="center">
        <Flex justify="start">
          <SortOpenStatus />
          <Header>Rides</Header>
        </Flex>
        <Flex direction="column" justify="center">
          {rides.map((ride) => (
            <RideCard
              key={ride.id}
              id={ride.id}
              title={ride.title}
              location={ride.location}
              price={ride.price}
            />
          ))}
        </Flex>
      </Flex>
    </div>
  );
}
