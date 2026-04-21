"use client";
import { Button } from "@radix-ui/themes";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Accept = ({ id }: { id: number }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      const response = await axios.patch(`/api/rides/${id}`, {
        action: "ACCEPT",
      });
      console.log("Ride Accepted", response.data);
      // refresh server components / data
      router.refresh();
    } catch (err: any) {
      // inspect common status codes from the accept flow
      const status = err?.response?.status;
      if (status === 403) console.log("Cannot accept your own ride");
      else if (status === 404) console.log("Ride not found");
      else if (status === 409) console.log("Ride already accepted");
      else console.log("Ride not accepted", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      color="green"
      onClick={handleClick}
      disabled={isLoading}
      loading={isLoading}
    >
      {isLoading ? "Accepting..." : "Accept"}
    </Button>
  );
};

export default Accept;
