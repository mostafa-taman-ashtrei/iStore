import PageContainer from "@/components/dashboard/PageContainer";
import { ProductColumn } from "./components/ProductColumns";
import Products from "./components/Products";
import { format } from "date-fns";
import { formatter } from "@/lib/utils";
import prismaDB from "@/lib/prisma";

interface ProductsPageProps {
    params: { storeId: string; };
}

const ProductsPage: React.FC<ProductsPageProps> = async ({ params }) => {
    const products = await prismaDB.product.findMany({
        where: {
            storeId: params.storeId
        },
        include: {
            category: true,
            size: true,
            color: true,
        },
        orderBy: {
            createdAt: "desc"
        }
    });

    const formattedProducts: ProductColumn[] = products.map((item) => ({
        id: item.id,
        name: item.name,
        isFeatured: item.isFeatured,
        isArchived: item.isArchived,
        price: formatter.format(item.price.toNumber()),
        category: item.category.name,
        size: item.size.name,
        color: item.color.value,
        createdAt: format(item.createdAt, "MMMM do, yyyy"),
    }));

    return (
        <PageContainer>
            <Products data={formattedProducts} />
        </PageContainer>
    );
};

export default ProductsPage;