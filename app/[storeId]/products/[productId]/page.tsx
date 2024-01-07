import PageContainer from "@/components/dashboard/PageContainer";
import ProductForm from "./components/ProductForm";
import prismaDB from "@/lib/prisma";

interface ProductPageProps {
    params: { productId: string, storeId: string }
}

const ProductPage: React.FC<ProductPageProps> = async ({ params }) => {
    const product = await prismaDB.product.findUnique({
        where: { id: params.productId },
        include: { images: true }
    });

    const categories = await prismaDB.category.findMany({
        where: { storeId: params.storeId }
    });

    const sizes = await prismaDB.size.findMany({
        where: { storeId: params.storeId }
    });

    const colors = await prismaDB.color.findMany({
        where: { storeId: params.storeId }
    });

    return (
        <PageContainer>
            <ProductForm
                categories={categories}
                colors={colors}
                sizes={sizes}
                initialData={product}
            />
        </PageContainer>
    );
};

export default ProductPage;