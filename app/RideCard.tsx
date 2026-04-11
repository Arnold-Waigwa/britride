import { Card, Flex, Text } from "@radix-ui/themes";
import Link from "next/link";

type Props = {
  title: string;
  location: string;
  price: number;
  id: number;
};

const RideCard = ({ title, location, price, id }: Props) => {
  return (
    <Card className="w-3xl mb-3">
      <Flex direction="column" align="center" className="w-auto">
        <Text>
          <Link href={`/rides/${id}`}>{title}</Link>
        </Text>
        <Text>{location}</Text>
        <Text>{price}</Text>
      </Flex>
    </Card>
  );
};

export default RideCard;
