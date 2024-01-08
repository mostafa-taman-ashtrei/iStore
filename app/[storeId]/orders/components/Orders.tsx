"use client";

import { OrderColumn, columns } from "./OrderColumns";

import { DataTable } from "@/components/dashboard/DataTable";
import Heading from "@/components/general/Heading";
import { Separator } from "@/components/ui/separator";

interface OrdersProps {
    data: OrderColumn[];
}

const Orders: React.FC<OrdersProps> = ({ data }) => {
    return (
        <>
            <Heading title={`Orders (${data.length})`} description="Manage orders for your store" />
            <Separator />
            <DataTable searchKey="products" columns={columns} data={data} />
        </>
    );
};

export default Orders;