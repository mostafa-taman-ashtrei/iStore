import BillboardForm from "./components/BillboardForm";
import prismaDB from "@/lib/prisma";

interface BillBoardPageProps {
    params: { billboardId: string }
}

const BillboardPage: React.FC<BillBoardPageProps> = async ({ params }) => {
    const billboard = await prismaDB.billboard.findUnique({
        where: {
            id: params.billboardId
        }
    });

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 px-4 lg:px-60 pt-6">
                <BillboardForm initialData={billboard} />
            </div>
        </div>
    );
};

export default BillboardPage;