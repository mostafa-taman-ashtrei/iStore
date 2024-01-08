import prismaDB from "@/lib/prisma";

export const getStockCount = async (storeId: string) => {
    const stockCount = await prismaDB.product.count({
        where: { storeId, isArchived: false }
    });

    return stockCount;
};