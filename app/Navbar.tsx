import { Flex } from "@radix-ui/themes";
import Link from "./components/Link";

const Navbar = () => {
  return (
    <Flex justify="between">
      <Link href="/">Home</Link>
      <Flex justify="end" className="mt-2 gap-13 ">
        <Link href="/request-a-ride">Request a ride</Link>
        <Link href="/">Login</Link>
      </Flex>
    </Flex>
  );
};

export default Navbar;
