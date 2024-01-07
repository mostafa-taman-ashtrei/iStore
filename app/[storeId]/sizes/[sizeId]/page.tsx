import PageContainer from "@/components/dashboard/PageContainer";
import SizeForm from "./components/SizeForm";
import prismaDB from "@/lib/prisma";

interface SizePageProps {
    params: { sizeId: string; };
}

const SizePage: React.FC<SizePageProps> = async ({ params }) => {
    const size = await prismaDB.size.findUnique({
        where: { id: params.sizeId }
    });

    return (
        <PageContainer>
            <SizeForm initialData={size} />
        </PageContainer>
    );
};

export default SizePage;