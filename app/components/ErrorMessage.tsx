import { Text } from "@radix-ui/themes";
import React, { PropsWithChildren } from "react";

const ErrorMessage = ({ children }: PropsWithChildren) => {
  return (
    <div>
      <Text color="red" as="p">
        {children}
      </Text>
    </div>
  );
};

export default ErrorMessage;
