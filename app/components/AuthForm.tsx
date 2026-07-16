"use client";
import React, { useState } from "react";
import z from "zod";
import { RegisterSchema, LoginSchema } from "../ValidationSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Callout,
  Card,
  Flex,
  Heading,
  Text,
  TextField,
} from "@radix-ui/themes";
import ErrorMessage from "./ErrorMessage";
import { useRouter } from "next/navigation";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { signIn } from "next-auth/react";
import axios from "axios";
import NextLink from "next/link";
import { Link as RadixLink } from "@radix-ui/themes";
//need a flag to distinguish the kind of form

interface Props {
  type: "Login" | "Register";
}

type Form = z.infer<typeof RegisterSchema>;

const AuthForm = ({ type }: Props) => {
  const [registered, setRegistered] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const isLogin = type === "Login";
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Form>({
    resolver: zodResolver(isLogin ? LoginSchema : RegisterSchema) as any,
  });
  const onSubmit = async (data: Form) => {
    setError("");
    let result;
    try {
      if (isLogin) {
        //login logic
        result = await signIn("credentials", {
          redirect: false,
          email: data.email,
          password: data.password,
        });
        if (result?.error) {
          setError("Invalid Username or Password");
        } else if (result?.ok) {
          router.push("/");
          router.refresh();
        }
      } else {
        //register logic
        await axios.post("/api/auth/register", data);
        setSubmittedEmail(data.email);
        setRegistered(true);
      }
    } catch (error: any) {
      setError(error.response?.data?.error || "An unexpected error occurred.");
    }
  };
  if (registered) {
    return (
      <div
        style={{
          maxWidth: 400,
          margin: "80px auto",
          padding: 24,
          textAlign: "center",
        }}
      >
        <h2>Check your email</h2>
        <p>
          We sent a verification link to <strong>{submittedEmail}</strong>.
        </p>
        <p style={{ color: "#666", fontSize: 14 }}>
          Click the link in the email to activate your account, then come back
          to sign in.
        </p>
      </div>
    );
  }
  return (
    <div className="max-w-md mx-auto mt-10 p-5">
      <Card className="shadow-lg">
        <Flex direction="column" gap="4">
          <Heading as="h1" align="center" size="6" mb="2">
            {isLogin ? "Login in with credentials" : "Sign up for an account"}
          </Heading>
          {error && (
            <Callout.Root color="red">
              <Callout.Icon>
                <InfoCircledIcon />
              </Callout.Icon>
              <Callout.Text>{error}</Callout.Text>
            </Callout.Root>
          )}
          <Flex direction="column">
            <form onSubmit={handleSubmit(onSubmit)}>
              <Flex direction="column" gap="4">
                {!isLogin && (
                  <Flex direction="column" gap="1">
                    <Text as="label" size="2" weight="bold">
                      username
                    </Text>
                    <TextField.Root
                      {...register("name")}
                      type="text"
                      placeholder="John Doe"
                    />
                    {errors.name && (
                      <ErrorMessage>{errors.name.message}</ErrorMessage>
                    )}
                  </Flex>
                )}
                <Flex direction="column" gap="1">
                  <Text as="label" size="2" weight="bold">
                    email
                  </Text>
                  <TextField.Root
                    {...register("email")}
                    type="email"
                    placeholder="example@albion.edu"
                  />
                  {errors.email && (
                    <ErrorMessage>{errors.email.message}</ErrorMessage>
                  )}
                </Flex>
                <Flex direction="column" gap="1">
                  <Text as="label" size="2" weight="bold">
                    password
                  </Text>
                  <TextField.Root
                    {...register("password")}
                    type="password"
                    placeholder="••••••••"
                  />
                  {errors.password && (
                    <ErrorMessage>{errors.password.message}</ErrorMessage>
                  )}
                </Flex>
              </Flex>
              <Button
                type="submit"
                mt="4"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? isLogin
                    ? "Logging in..."
                    : "Registering..."
                  : isLogin
                    ? "Login"
                    : "Sign Up"}
              </Button>
            </form>
          </Flex>

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
            Sign in with your Albion email
          </Button>

          <Text align="center" size="2" color="gray" mt="2">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <RadixLink asChild>
              {isLogin ? (
                <NextLink href="/register">Sign up</NextLink>
              ) : (
                <NextLink href="/login">Log in</NextLink>
              )}
            </RadixLink>
          </Text>
        </Flex>
      </Card>
    </div>
  );
};

export default AuthForm;
