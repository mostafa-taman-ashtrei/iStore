import PageContainer from "@/components/dashboard/PageContainer";
import { SizeColumn } from "./components/SizeColumns";
import Sizes from "./components/Sizes";
import { format } from "date-fns";
import prismaDB from "@/lib/prisma";

interface SizePageProps {
    params: { storeId: string; };
}

const SizesPage: React.FC<SizePageProps> = async ({ params }) => {
    const sizes = await prismaDB.size.findMany({
        where: { storeId: params.storeId },
        orderBy: { createdAt: "desc" }
    });

    const formattedSizes: SizeColumn[] = sizes.map((item) => ({
        id: item.id,
        name: item.name,
        value: item.value,
        createdAt: format(item.createdAt, "MMMM do, yyyy"),
    }));

    return (
        <PageContainer>
            <Sizes data={formattedSizes} />
        </PageContainer>

    );
};

export default SizesPage;