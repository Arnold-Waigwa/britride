"use client";
import { Box, Button, Flex, TextField } from "@radix-ui/themes";
import "easymde/dist/easymde.min.css";
import { Controller, useForm } from "react-hook-form";
import SimpleMDE from "react-simplemde-editor";
import ErrorMessage from "../components/ErrorMessage";
import Header from "../components/Header";

//location, description, price

type Form = {
  location: string;
  description: string;
  content: string;
  price: number;
};

const page = () => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<Form>();

  const onSubmit = (data: Form) => {
    console.log("submit", data);
    reset();
  };

  return (
    <>
      <Header>Request A Ride</Header>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Flex direction="column">
          <Box width="500px" mt="4">
            <TextField.Root
              size="3"
              placeholder="location..."
              {...register("location", { required: "location required" })}
            />
            {errors.location && (
              <ErrorMessage>{errors.location.message}</ErrorMessage>
            )}
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
          <Box mt="4">
            <TextField.Root
              type="number"
              placeholder="How much would you like to pay?"
              {...register("price", {
                valueAsNumber: true,
                min: { value: 0, message: "Must be >= 0" },
              })}
            />
          </Box>
          <Box mt="4">
            <Button className="max-w-2xl w-full">Submit</Button>
          </Box>
        </Flex>
      </form>
    </>
  );
};

export default page;
