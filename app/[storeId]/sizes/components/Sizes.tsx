"use client";

import { SizeColumn, columns } from "./SizeColumns";
import { useParams, useRouter } from "next/navigation";

import ApiList from "@/components/dashboard/ApiList";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/dashboard/DataTable";
import Heading from "@/components/general/Heading";
import { PlusCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface SizesClientProps {
    data: SizeColumn[];
}

const Sizes: React.FC<SizesClientProps> = ({ data }) => {
    const params = useParams();
    const router = useRouter();

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading title={`Sizes (${data.length})`} description="Manage sizes for your products" />

                <Button onClick={() => router.push(`/${params.storeId}/sizes/new`)} variant="secondary" className="w-1/2">
                    <PlusCircle className="mr-2 h-4 w-4 text-sky-600" /> New Size
                </Button>
            </div>

            <Separator />
            <DataTable searchKey="name" columns={columns} data={data} />

            <Heading title="API" description="API Calls for Sizes" />

            <Separator />
            <ApiList entityName="sizes" entityIdName="sizeId" />
        </>
    );
};

export default Sizes;