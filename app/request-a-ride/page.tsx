import { Flex, Box, TextArea, TextField } from "@radix-ui/themes";
import React from "react";

//location, description, price

const page = () => {
  return (
    <Flex>
      <Box width="500px" mt="4">
        <TextField.Root placeholder="location..." size="3" />
      </Box>
    </Flex>
  );
};

export default page;
