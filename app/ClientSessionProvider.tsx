"use client";
import { SessionProvider } from "next-auth/react";
import { PropsWithChildren } from "react";

const ClientSessionProvider = ({ children }: PropsWithChildren) => {
  return <SessionProvider children={children}></SessionProvider>;
};

export default ClientSessionProvider;
