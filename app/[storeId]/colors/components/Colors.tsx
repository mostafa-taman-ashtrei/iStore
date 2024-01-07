"use client";

import { ColorColumn, columns } from "./ColorColumns";
import { useParams, useRouter } from "next/navigation";

import ApiList from "@/components/dashboard/ApiList";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/dashboard/DataTable";
import Heading from "@/components/general/Heading";
import { PlusCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface ColorClientProps {
    data: ColorColumn[];
}

const Colors: React.FC<ColorClientProps> = ({ data }) => {
    const params = useParams();
    const router = useRouter();

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading title={`Colors (${data.length})`} description="Manage colors for your products" />
                <Button onClick={() => router.push(`/${params.storeId}/colors/new`)} variant="secondary">
                    <PlusCircle className="mr-2 h-4 w-4 text-sky-600" /> New Color
                </Button>
            </div>

            <Separator />
            <DataTable searchKey="name" columns={columns} data={data} />

            <Heading title="API" description="API Calls for Colors" />

            <Separator />
            <ApiList entityName="colors" entityIdName="colorId" />
        </>
    );
};

export default Colors;