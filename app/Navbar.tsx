import { Flex } from "@radix-ui/themes";
import Link from "./components/Link";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth";

const Navbar = async () => {
  const session = await getServerSession(authOptions);
  return (
    <Flex justify="between">
      <Link href="/">Home</Link>
      <Flex justify="end" className="mt-2 gap-13 ">
        <Link href="/request-a-ride">Request a ride</Link>
        {session?.user ? (
          <>
            <Link href="/">My Rides</Link>
            <Link href="/api/auth/signout">Signout</Link>
          </>
        ) : (
          <Link href="/login">Login</Link>
        )}
      </Flex>
    </Flex>
  );
};

export default Navbar;
