import { BillboardColumn } from "./components/BillboardColumns";
import Billboards from "./components/Billboards";
import PageContainer from "@/components/dashboard/PageContainer";
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
        <PageContainer>
            <Billboards data={formattedBillboards} />
        </PageContainer>
    );
};

export default BillboardsPage;