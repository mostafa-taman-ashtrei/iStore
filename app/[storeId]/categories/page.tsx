import Categories from "./components/Categories";
import { CategoryColumn } from "./components/CategoryColumns";
import PageContainer from "@/components/dashboard/PageContainer";
import { format } from "date-fns";
import prismaDB from "@/lib/prisma";

interface CategoriesPageProps {
    params: { storeId: string; };
}

const CategoriesPage: React.FC<CategoriesPageProps> = async ({ params }) => {
    const categories = await prismaDB.category.findMany({
        where: { storeId: params.storeId },
        include: { billboard: true },
        orderBy: { createdAt: "desc" }
    });

    const formattedCategories: CategoryColumn[] = categories.map((item) => ({
        id: item.id,
        name: item.name,
        billboardLabel: item.billboard.label,
        createdAt: format(item.createdAt, "MMMM do, yyyy"),
    }));

    return (
        <PageContainer>
            <Categories data={formattedCategories} />
        </PageContainer>
    );
};

export default CategoriesPage;