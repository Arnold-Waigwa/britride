import React from "react";
import AuthForm from "../components/AuthForm";
import { Metadata } from "next";

const page = () => {
  return <AuthForm type="Register" />;
};

export default page;

export const metadata: Metadata = {
  title: "Register page",
  description: "Page to register",
};
