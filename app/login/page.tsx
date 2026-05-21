"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import {
  Button,
  Callout,
  Card,
  Flex,
  Heading,
  Text,
  TextField,
} from "@radix-ui/themes";
import Link from "../components/Link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import ErrorMessage from "../components/ErrorMessage";
import { LoginSchema } from "../ValidationSchema";

type Form = z.infer<typeof LoginSchema>;

const page = () => {
  const router = useRouter();
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Form>({ resolver: zodResolver(LoginSchema) });

  const onSubmit = async (data: Form) => {
    setError("");
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });
      if (result?.error) {
        setError("Invalid Email or Password");
      } else if (result?.ok) {
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      setError("An unexpected error occurred");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-5">
      <Card size="4" className="shadow-lg">
        <Flex direction="column" gap="4">
          <Heading as="h1" align="center" size="6" mb="2">
            Sign in with credentials
          </Heading>
          {/* Here we'll display our errors using callout.root */}
          {error && (
            <Callout.Root color="red">
              <Callout.Icon>
                <InfoCircledIcon />
              </Callout.Icon>
              <Callout.Text>{error}</Callout.Text>
            </Callout.Root>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <Flex direction="column" gap="4">
              <Flex direction="column" gap="1">
                <Text as="label" size="2" weight="bold">
                  Email
                </Text>
                <TextField.Root
                  placeholder="email@albion.edu"
                  {...register("email")}
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
                  type="password"
                />
                {errors.password && (
                  <ErrorMessage>{errors.password.message}</ErrorMessage>
                )}
              </Flex>
              <Button mt="4" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "logging in..." : "Login"}
              </Button>
            </Flex>
          </form>

          <Flex align="center" gap="3">
            <div
              style={{
                flex: 1,
                height: "1px",
                backgroundColor: "var(--gray-a6)",
              }}
            />
            <Text size="2" color="gray">
              or
            </Text>
            <div
              style={{
                flex: 1,
                height: "1px",
                backgroundColor: "var(--gray-a6)",
              }}
            />
          </Flex>

          <Button
            variant="soft"
            color="gray"
            className="w-full"
            onClick={() => signIn("google", { callbackUrl: "/" })}
          >
            Sign in with Google
          </Button>
          <Flex align="center" justify="center" gap="2">
            <Text color="gray" weight="light" size="1">
              Don't Have an account?
            </Text>
            <Link href="/register">Sign up</Link>
          </Flex>
        </Flex>
      </Card>
    </div>
  );
};

export default page;
