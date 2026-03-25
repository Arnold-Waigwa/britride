import { Card, Text } from "@radix-ui/themes";

type Props = {
  name: string;
  destination?: string;
  price: number;
};

const RideCard = ({ name, destination, price }: Props) => {
  return (
    <Card>
      <Text>{name}</Text>
      <Text>{destination}</Text>
      <Text>{price}</Text>
    </Card>
  );
};

export default RideCard;
