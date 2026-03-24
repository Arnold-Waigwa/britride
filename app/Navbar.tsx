import { Flex, Text } from "@radix-ui/themes";
import React from "react";

const Navbar = () => {
  return (
    <Flex justify="end" gap="3" className="mt-2 pl-7">
      <Text>Request a ride</Text>
      <Text>Login</Text>
    </Flex>
  );
};

export default Navbar;
