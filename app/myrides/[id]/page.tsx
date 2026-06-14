import RideCard from "@/app/RideCard";
import prisma from "@/prisma/client";
import { Flex, Heading } from "@radix-ui/themes";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params; //user id
  const myRides = await prisma.user.findUnique({
    where: { id: parseInt(id) },
    include: {
      postedRides: {
        orderBy: { createdAt: "desc" },
      },
    },
  });
  return (
    <Flex direction="column" justify="center" align="center">
      {myRides?.postedRides && myRides.postedRides.length > 0 ? (
        myRides.postedRides.map((ride) => (
          <RideCard
            key={ride.id}
            id={ride.id}
            location={ride.location}
            price={ride.price}
            title={ride.title}
          />
        ))
      ) : (
        <Heading>No rides yet</Heading>
      )}
    </Flex>
  );
};

export default page;
