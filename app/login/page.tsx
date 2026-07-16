import { Metadata } from "next";
import AuthForm from "../components/AuthForm";

const page = async ({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; verified?: string }>;
}) => {
  const { error, verified } = await searchParams;
  return (
    <>
      {verified && (
        <p style={{ color: "green" }}>Email verified! You can now sign in.</p>
      )}
      {error === "Please verify your email before signing in" && (
        <p style={{ color: "orange" }}>
          Please check your email and verify your account first.
        </p>
      )}
      <AuthForm type="Login" />
    </>
  );
};

export default page;

export const metadata: Metadata = {
  title: "Login page",
  description: "Page to login",
};
