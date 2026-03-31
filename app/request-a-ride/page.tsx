"use client";
import { Flex, Box, TextArea, TextField } from "@radix-ui/themes";
import React, { useState } from "react";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";

//location, description, price

const page = () => {
  const [data, setData] = useState({ location: "", description: "" });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Flex direction="column">
      <Box width="500px" mt="4">
        <TextField.Root
          placeholder="location..."
          size="3"
          value={data.location}
          name="location"
          onChange={handleChange}
        />
      </Box>
      <Box width="500px" mt="4">
        <TextField.Root
          placeholder="description..."
          size="3"
          value={data.description}
          name="description"
          onChange={handleChange}
        />
      </Box>
      <Box mt="4">
        <SimpleMDE placeholder="Testing Simplemde..." />
      </Box>
    </Flex>
  );
};

export default page;
