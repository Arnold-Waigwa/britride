import Header from "@/app/components/Header";

interface Props {
  params: Promise<{ id: string }>;
}

const page = async ({ params }: Props) => {
  const { id } = await params;
  return (
    <div>
      <Header>{id}</Header>
    </div>
  );
};

export default page;
