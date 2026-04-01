"use client";
import { Box, Flex, TextField } from "@radix-ui/themes";
import "easymde/dist/easymde.min.css";
import { Controller, useForm } from "react-hook-form";
import SimpleMDE from "react-simplemde-editor";

//location, description, price

type Form = {
  location: string;
  description: string;
  content: string;
};

const page = () => {
  const { register, handleSubmit, control } = useForm<Form>();

  return (
    <Flex direction="column">
      <Box width="500px" mt="4">
        <TextField.Root
          size="3"
          placeholder="location..."
          {...register("location")}
        />
      </Box>
      <Box width="500px" mt="4">
        <TextField.Root
          size="3"
          placeholder="description..."
          {...register("description")}
        />
      </Box>
      <Box mt="4">
        <Controller
          name="content"
          control={control}
          render={({ field }) => (
            <SimpleMDE placeholder="Testing Simplemde..." {...field} />
          )}
        />
      </Box>
    </Flex>
  );
};

export default page;
