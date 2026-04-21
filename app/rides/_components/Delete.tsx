"use client";
import { AlertDialog, Button, Flex, Spinner } from "@radix-ui/themes";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Delete = ({ id }: { id: number }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(false);
  const router = useRouter();
  const deleteRide = async () => {
    try {
      setIsDeleting(true);
      const response = await axios.delete("/api/rides/" + id);
      console.log(response, "Ride deleted Successfully");
      router.push("/");
      router.refresh();
    } catch (error) {
      setError(true);
      console.log(error, "error deleting ride");
    } finally {
      setIsDeleting(false);
    }
  };
  return (
    <>
      <AlertDialog.Root>
        <AlertDialog.Trigger>
          <Button color="red" disabled={isDeleting}>
            {isDeleting && <Spinner />}
            Delete
          </Button>
        </AlertDialog.Trigger>
        <AlertDialog.Content>
          <AlertDialog.Title>Delete Ride</AlertDialog.Title>
          <AlertDialog.Description>
            Are you sure you want to delete this ride? This action cannot be
            undone!
          </AlertDialog.Description>
          <Flex gap="3" mt="4" justify="end">
            <AlertDialog.Cancel>
              <Button variant="soft" color="gray">
                Cancel
              </Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action>
              <Button
                variant="solid"
                color="red"
                onClick={deleteRide}
                disabled={isDeleting}
              >
                Delete
              </Button>
            </AlertDialog.Action>
          </Flex>
        </AlertDialog.Content>
      </AlertDialog.Root>
      <AlertDialog.Root open={error}>
        <AlertDialog.Content>
          <AlertDialog.Title color="red">Error</AlertDialog.Title>
          <AlertDialog.Description>Error deleting ride</AlertDialog.Description>
          <Button color="gray" onClick={() => setError(false)}>
            OK
          </Button>
        </AlertDialog.Content>
      </AlertDialog.Root>
    </>
  );
};

export default Delete;
