import ColorForm from "./components/ColorForm";
import PageContainer from "@/components/dashboard/PageContainer";
import prismaDB from "@/lib/prisma";

interface ColorPageProps {
    params: { colorId: string; };
}

const ColorPage: React.FC<ColorPageProps> = async ({ params }) => {
    const color = await prismaDB.color.findUnique({
        where: { id: params.colorId }
    });

    return (
        <PageContainer>
            <ColorForm initialData={color} />
        </PageContainer>
    );
};

export default ColorPage;