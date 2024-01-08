"use client";

import { BillboardColumn, columns } from "./BillboardColumns";
import { useParams, useRouter } from "next/navigation";

import ApiList from "@/components/dashboard/ApiList";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/dashboard/DataTable";
import Heading from "@/components/general/Heading";
import { PlusCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface BillboardsProps {
    data: BillboardColumn[];
}

const Billboards: React.FC<BillboardsProps> = ({ data }) => {
    const params = useParams();
    const router = useRouter();

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading title={`Billboards (${data.length})`} description="Manage billboards for your store" />

                <Button onClick={() => router.push(`/${params.storeId}/billboards/new`)} variant="secondary" className="w-1/2">
                    <PlusCircle className="mr-2 h-4 w-4 text-sky-600" /> New BillBoard
                </Button>
            </div>

            <Separator />

            <DataTable searchKey="label" columns={columns} data={data} />

            <Heading title="API" description="API Calls for Billboards" />

            <Separator />

            <ApiList entityName="billboards" entityIdName="billboardId" />
        </>
    );
};

export default Billboards;