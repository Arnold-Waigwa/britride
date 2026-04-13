import BritForm from "@/app/components/BritForm";
import Header from "@/app/components/Header";
import prisma from "@/prisma/client";

interface Props {
  params: Promise<{ id: string }>;
}

const page = async ({ params }: Props) => {
  const { id } = await params;
  const ride = await prisma.ride.findUnique({
    where: { id: parseInt(id) },
  });

  return (
    <div>
      <BritForm ride={ride} />
    </div>
  );
};

export default page;
