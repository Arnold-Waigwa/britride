"use client";
import axios from "axios";
import { useForm } from "react-hook-form";
import z from "zod";
import { RegisterSchema } from "../ValidationSchema";
import {
  Flex,
  TextField,
  Button,
  Card,
  Heading,
  Text,
  Callout,
} from "@radix-ui/themes";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import ErrorMessage from "../components/ErrorMessage";
import { useRouter } from "next/navigation";
import { useState } from "react";
//use more efficient useForms hooks that uses uncontrolled non rendered forms per stroke
//use zod schema type safety to ensure type correctness
//use zod resolver to validate front end data coming in

type Form = z.infer<typeof RegisterSchema>;

const Page = () => {
  const router = useRouter();
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Form>({ resolver: zodResolver(RegisterSchema) });

  const onSubmit = async (data: Form) => {
    try {
      setError("");
      await axios.post("/api/auth/register", data);
      router.push("/");
    } catch (error: any) {
      setError(error.response?.data?.error || "An unexpected error occurred.");
    }
  };
  return (
    <div className="max-w-md mx-auto mt-10 p-5">
      <Card size="4" className="shadow-lg">
        <Flex direction="column" gap="4">
          <Heading as="h2" align="center" size="6" mb="2">
            Create Account
          </Heading>

          {error && (
            <Callout.Root color="red">
              <Callout.Icon>
                <InfoCircledIcon />
              </Callout.Icon>
              <Callout.Text>{error}</Callout.Text>
            </Callout.Root>
          )}

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <Flex direction="column" gap="4">
              <Flex direction="column" gap="1">
                <Text as="label" size="2" weight="bold">
                  Name
                </Text>
                <TextField.Root
                  placeholder="Your Name"
                  {...register("name")}
                  onChange={() => setError("")}
                />
                {errors.name && (
                  <ErrorMessage>{errors.name.message}</ErrorMessage>
                )}
              </Flex>

              <Flex direction="column" gap="1">
                <Text as="label" size="2" weight="bold">
                  Email
                </Text>
                <TextField.Root
                  placeholder="email@albion.edu"
                  {...register("email")}
                  onChange={() => setError("")}
                  type="email"
                />
                {errors.email && (
                  <ErrorMessage>{errors.email.message}</ErrorMessage>
                )}
              </Flex>

              <Flex direction="column" gap="1">
                <Text as="label" size="2" weight="bold">
                  Password
                </Text>
                <TextField.Root
                  placeholder="••••••••"
                  {...register("password")}
                  onChange={() => setError("")}
                  type="password"
                />
                {errors.password && (
                  <ErrorMessage>{errors.password.message}</ErrorMessage>
                )}
              </Flex>
            </Flex>

            <Button
              mt="4"
              className="w-full"
              disabled={isSubmitting || !!error}
            >
              {isSubmitting ? "Registering..." : "Register"}
            </Button>
          </form>
        </Flex>
      </Card>
    </div>
  );
};

export default Page;
