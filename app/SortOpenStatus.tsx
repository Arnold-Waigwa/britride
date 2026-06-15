"use client";
import { Button } from "@radix-ui/themes";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";

const SortOpenStatus = () => {
  //get current query params
  const [openRides, setOpenRides] = useState(false);
  const params = useSearchParams() || "";
  const router = useRouter();
  //filter by open status
  const handleClick = () => {
    if (!openRides) {
      const current = new URLSearchParams(params.toString());
      current.set("filter", "OPEN");
      setOpenRides(true);
      router.push(`?${current.toString()}`);
    } else {
      setOpenRides(false);
      router.push("/");
    }
  };
  return (
    <>
      {openRides ? (
        <Button onClick={handleClick}>All Rides</Button>
      ) : (
        <Button onClick={handleClick}>Open Rides</Button>
      )}
    </>
  );
};

export default SortOpenStatus;
