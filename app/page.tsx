import { Flex } from "@radix-ui/themes";
import RideCard from "./RideCard";
import Header from "./components/Header";
import prisma from "@/prisma/client";

export default async function Home() {
  const rides = await prisma.ride.findMany();
  return (
    <div>
      <Flex direction="column" justify="center" align="center">
        <Header>Rides</Header>
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
