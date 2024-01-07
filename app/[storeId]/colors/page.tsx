import { ColorColumn } from "./components/ColorColumns";
import Colors from "./components/Colors";
import PageContainer from "@/components/dashboard/PageContainer";
import { format } from "date-fns";
import prismaDB from "@/lib/prisma";

interface ColorsPageProps {
    params: { storeId: string; };
}

const ColorsPage: React.FC<ColorsPageProps> = async ({ params }) => {
    const colors = await prismaDB.color.findMany({
        where: { storeId: params.storeId },
        orderBy: { createdAt: "desc" }
    });

    const formattedColors: ColorColumn[] = colors.map((item) => ({
        id: item.id,
        name: item.name,
        value: item.value,
        createdAt: format(item.createdAt, "MMMM do, yyyy"),
    }));

    return (
        <PageContainer>
            <Colors data={formattedColors} />
        </PageContainer>
    );
};

export default ColorsPage;