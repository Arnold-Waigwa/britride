import Header from "@/app/components/Header";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return <Header>{id}</Header>;
};

export default page;
