import { Heading } from "@radix-ui/themes";
import { PropsWithChildren } from "react";

const Header = ({ children }: PropsWithChildren) => {
  return (
    <Heading size="7" mb="2">
      {children}
    </Heading>
  );
};

export default Header;
