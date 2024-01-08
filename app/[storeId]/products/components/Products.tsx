"use client";

import { ProductColumn, columns } from "./ProductColumns";
import { useParams, useRouter } from "next/navigation";

import ApiList from "@/components/dashboard/ApiList";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/dashboard/DataTable";
import Heading from "@/components/general/Heading";
import { PlusCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface ProductsProps {
    data: ProductColumn[];
}

const Products: React.FC<ProductsProps> = ({ data }) => {
    const params = useParams();
    const router = useRouter();

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading title={`Products (${data.length})`} description="Manage products for your store" />

                <Button onClick={() => router.push(`/${params.storeId}/products/new`)} variant="secondary" className="w-1/2">
                    <PlusCircle className="mr-2 h-4 w-4 text-sky-600" /> New Product
                </Button>
            </div>

            <Separator />
            <DataTable searchKey="name" columns={columns} data={data} />

            <Heading title="API" description="API Calls for Products" />

            <Separator />
            <ApiList entityName="products" entityIdName="productId" />
        </>
    );
};

export default Products;