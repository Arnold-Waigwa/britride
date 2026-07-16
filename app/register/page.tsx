import { Metadata } from "next";
import AuthForm from "../components/AuthForm";

const page = () => {
  return <AuthForm type="Register" />;
};

export default page;

export const metadata: Metadata = {
  title: "Register page",
  description: "Page to register",
};
