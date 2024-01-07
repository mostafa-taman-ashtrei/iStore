import CategoryForm from "./components/CategoryForm";
import PageContainer from "@/components/dashboard/PageContainer";
import prismaDB from "@/lib/prisma";

interface CategoryPageProps {
    params: { categoryId: string, storeId: string }
}

const CategoryPage: React.FC<CategoryPageProps> = async ({ params }) => {
    const category = await prismaDB.category.findUnique({
        where: { id: params.categoryId }
    });

    const billboards = await prismaDB.billboard.findMany({
        where: { storeId: params.storeId }
    });

    return (
        <PageContainer>
            <CategoryForm billboards={billboards} initialData={category} />

        </PageContainer>

    );
};

export default CategoryPage;