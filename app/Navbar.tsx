import { Flex } from "@radix-ui/themes";
import Link from "./components/Link";

const Navbar = () => {
  return (
    <Flex justify="end" className="mt-2 gap-13  w-[800px] mx-auto">
      <Link href="/request-a-ride">Request a ride</Link>
      <Link href="/login">Login</Link>
    </Flex>
  );
};

export default Navbar;
