"use client";
import { Button } from "@radix-ui/themes";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const Accept = ({ id }: { id: number }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      const response = await axios.patch(`/api/rides/${id}`, {
        action: "ACCEPT",
      });
      toast.success("Ride Accepted", { position: "top-center" });
      // refresh server components / data
      router.refresh();
    } catch (err: any) {
      // inspect common status codes from the accept flow
      const status = err?.response?.status;
      if (status === 403) toast.error("Cannot accept your own ride");
      else if (status === 404) toast.error("Ride not found");
      else if (status === 409) toast.error("Ride already accepted");
      else toast.error("Ride not accepted", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        color="green"
        onClick={handleClick}
        disabled={isLoading}
        loading={isLoading}
      >
        {isLoading ? "Accepting..." : "Accepted"}
      </Button>
      <Toaster />
    </>
  );
};

export default Accept;
