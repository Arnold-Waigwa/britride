"use client";
import { Box, Button, Flex, TextField } from "@radix-ui/themes";
import axios from "axios";
import "easymde/dist/easymde.min.css";
import { Controller, useForm } from "react-hook-form";
import SimpleMDE from "react-simplemde-editor";
import ErrorMessage from "../components/ErrorMessage";

type Form = {
  location: string;
  description: string;
  content: string;
  price: number;
};

const BritForm = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Form>();
  const onSubmit = async (data: Form) => {
    //take the data object, send the information with axios to api for database processing
    try {
      const response = await axios.post("/api/rides", data);

      if (response.status === 200) {
        console.log("Ride submitted successfully:", response.data);
      } else {
        console.log("Unexpected response:", response.status, response.data);
      }
    } catch (error) {
      console.log("error", error);
    }
  };
  return (
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
  );
};

export default BritForm;
