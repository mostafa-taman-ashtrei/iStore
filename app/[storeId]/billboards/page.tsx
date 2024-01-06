import BillboardClient from "./components/BillboardClient";
import { BillboardColumn } from "./components/Columns";
import { format } from "date-fns";
import prismaDB from "@/lib/prisma";

interface BillboardsPageProps {
    params: { storeId: string }
}

const BillboardsPage: React.FC<BillboardsPageProps> = async ({ params }) => {
    const billboards = await prismaDB.billboard.findMany({
        where: { storeId: params.storeId },
        orderBy: { createdAt: "desc" }
    });

    const formattedBillboards: BillboardColumn[] = billboards.map((item) => ({
        id: item.id,
        label: item.label,
        createdAt: format(item.createdAt, "MMMM do, yyyy"),
    }));

    return (
        <div className="flex-col mb-5">
            <div className="flex-1 space-y-4 px-4 lg:px-60 pt-6">
                <BillboardClient data={formattedBillboards} />
            </div>
        </div>
    );
};

export default BillboardsPage;