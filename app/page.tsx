import { Flex } from "@radix-ui/themes";
import RideCard from "./RideCard";
import Header from "./components/Header";

export default function Home() {
  const rides: { name: string; destination?: string; price: number }[] = [
    { name: "John Doe", destination: "Jackson", price: 20 },
    { name: "Jane Doe", destination: "Ann Arbor", price: 30 },
  ]; //fetch from database

  return (
    <div>
      <Flex direction="column" justify="center" align="center">
        <Header>
          <h1>Rides</h1>
        </Header>
        <Flex direction="column" justify="center">
          {rides.map((ride) => (
            <RideCard
              key={ride.name}
              name={ride.name}
              destination={ride.destination}
              price={ride.price}
            />
          ))}
        </Flex>
      </Flex>
    </div>
  );
}
