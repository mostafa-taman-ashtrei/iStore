import { OrderColumn } from "./components/OrderColumns";
import Orders from "./components/Orders";
import PageContainer from "@/components/dashboard/PageContainer";
import { format } from "date-fns";
import { formatter } from "@/lib/utils";
import prismaDB from "@/lib/prisma";

interface OrdersPageProps {
    params: { storeId: string; };
}

const OrdersPage: React.FC<OrdersPageProps> = async ({ params }) => {
    const orders = await prismaDB.order.findMany({
        where: { storeId: params.storeId },
        include: { orderItems: { include: { product: true } } },
        orderBy: { createdAt: "desc" }
    });

    const formattedOrders: OrderColumn[] = orders.map((item) => ({
        id: item.id,
        phone: item.phone,
        address: item.address,
        products: item.orderItems.map((orderItem) => orderItem.product.name).join(", "),
        totalPrice: formatter.format(item.orderItems.reduce((total, item) => {
            return total + Number(item.product.price);
        }, 0)),
        isPaid: item.isPaid,
        createdAt: format(item.createdAt, "MMMM do, yyyy"),
    }));

    return (
        <PageContainer>
            <Orders data={formattedOrders} />
        </PageContainer>
    );
};

export default OrdersPage;