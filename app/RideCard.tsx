import { Card, Flex, Text, Box, Badge, Heading } from "@radix-ui/themes";
import Link from "./components/Link";
import { RideStatus } from "@prisma/client";

type Props = {
  title: string;
  location: string;
  price: number;
  id: number;
  status: RideStatus;
};

const RideCard = ({ title, location, price, id, status }: Props) => {
  return (
    <Box mb="4" position="relative" className="group">
      {/* Ticket Cutout Effect (Decorative) */}
      <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-8 bg-[#0a0a0a] rounded-full z-10 hidden md:block" />

      <Card
        size="3"
        variant="surface"
        style={{
          borderRadius: "var(--radius-5)",
          borderLeft: "4px solid var(--purple-9)",
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
        }}
        className="hover:-translate-y-1 hover:shadow-xl w-[350px] md:w-[600px]"
      >
        <Flex justify="between" align="center">
          <Flex direction="column" gap="1">
            <Heading as="h3" size="4" trim="both">
              <Link
                href={`/rides/${id}`}
                className="hover:text-[var(--purple-9)] transition-colors no-underline text-[var(--gray-12)]"
              >
                {title}
              </Link>
            </Heading>
            <Flex align="center" gap="2">
              <div className="w-2 h-2 rounded-full bg-[var(--purple-9)]" />
              <Text size="2" color="gray" weight="medium">
                {location}
              </Text>
            </Flex>
          </Flex>

          <Flex direction="column" align="end" gap="2">
            <Text size="5" weight="bold" color="purple">
              ${price}
            </Text>
            <Badge color="purple" variant="soft" radius="full">
              {status}
            </Badge>
          </Flex>
        </Flex>
      </Card>
    </Box>
  );
};

export default RideCard;
