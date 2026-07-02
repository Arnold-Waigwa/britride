import React from "react";
import AuthForm from "../components/AuthForm";
import { Metadata } from "next";

const page = () => {
  return <AuthForm type="Login" />;
};

export default page;

export const metadata: Metadata = {
  title: "Login page",
  description: "Page to login",
};
