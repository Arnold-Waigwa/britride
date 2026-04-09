import { Card, Flex, Text } from "@radix-ui/themes";

type Props = {
  title: string;
  location: string;
  price: number;
};

const RideCard = ({ title, location, price }: Props) => {
  return (
    <Card className="w-3xl mb-3">
      <Flex direction="column" align="center" className="w-auto">
        <Text>{title}</Text>
        <Text>{location}</Text>
        <Text>{price}</Text>
      </Flex>
    </Card>
  );
};

export default RideCard;
