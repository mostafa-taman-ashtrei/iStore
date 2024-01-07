import BillboardForm from "./components/BillboardForm";
import PageContainer from "@/components/dashboard/PageContainer";
import prismaDB from "@/lib/prisma";

interface BillBoardPageProps {
  params: { billboardId: string };
}

const BillboardPage: React.FC<BillBoardPageProps> = async ({ params }) => {
  const billboard = await prismaDB.billboard.findUnique({
    where: {
      id: params.billboardId,
    },
  });

  return (
    <PageContainer>
      <BillboardForm initialData={billboard} />
    </PageContainer>
  );
};

export default BillboardPage;
