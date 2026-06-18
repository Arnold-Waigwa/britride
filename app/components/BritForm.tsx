"use client";
import { Box, Button, Flex, TextField } from "@radix-ui/themes";
import axios from "axios";
import "easymde/dist/easymde.min.css";
import { Controller, useForm } from "react-hook-form";
import SimpleMDE from "react-simplemde-editor";
import ErrorMessage from "../components/ErrorMessage";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { RideSchemaPost } from "../ValidationSchema";
import { useRouter } from "next/navigation";
import { Ride } from "@prisma/client";

type Form = z.infer<typeof RideSchemaPost>;

interface Props {
  ride?: Ride | null;
}

const BritForm = ({ ride }: Props) => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<Form>({
    resolver: zodResolver(RideSchemaPost),
    defaultValues: {
      title: ride?.title,
      location: ride?.location,
      description: ride?.description,
      price: ride?.price,
    },
  });
  const onSubmit = async (data: Form) => {
    try {
      let response;

      if (ride) {
        response = await axios.patch(`/api/rides/${ride.id}`, data);
      } else {
        response = await axios.post("/api/rides", data);
      }

      if (response.status === 201 || response.status === 200) {
        console.log("Ride submitted successfully:", response.data);
        router.refresh();
        router.push("/");
      } else {
        console.log("Unexpected response:", response.status, response.data);
      }
    } catch (error) {
      console.log("error", error);
    }
  };
  return (
    <Box className="max-w-2xl">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Flex direction="column" gap="4" mt="4">
          <TextField.Root
            size="3"
            placeholder="Enter a descriptive title (e.g., Grocery run in Jackson)"
            {...register("title")}
          />
          {errors.title && <ErrorMessage>{errors.title.message}</ErrorMessage>}

          <TextField.Root
            size="3"
            placeholder="Destination"
            {...register("location")}
          />
          {errors.location && (
            <ErrorMessage>{errors.location.message}</ErrorMessage>
          )}

          <Box>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <SimpleMDE
                  placeholder="Provide details about meeting point, stops, baggage space, or preferences..."
                  {...field}
                />
              )}
            />
            {errors.description && (
              <ErrorMessage>{errors.description.message}</ErrorMessage>
            )}
          </Box>

          <TextField.Root
            type="number"
            size="3"
            placeholder="Suggested Price ($)"
            {...register("price", {
              valueAsNumber: true,
            })}
          />
          {errors.price && <ErrorMessage>{errors.price.message}</ErrorMessage>}

          <Button size="3" mt="2" disabled={isSubmitting}>
            {ride ? "Save Changes" : "Publish Ride"}
          </Button>
        </Flex>
      </form>
    </Box>
  );
};

export default BritForm;
