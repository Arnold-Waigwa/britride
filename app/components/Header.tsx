import React, { PropsWithChildren } from "react";

const Header = ({ children }: PropsWithChildren) => {
  return <div className="text-3xl">{children}</div>;
};

export default Header;
