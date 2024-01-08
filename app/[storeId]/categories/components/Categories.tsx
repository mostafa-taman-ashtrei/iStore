"use client";

import { CategoryColumn, columns } from "./CategoryColumns";
import { useParams, useRouter } from "next/navigation";

import ApiList from "@/components/dashboard/ApiList";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/dashboard/DataTable";
import Heading from "@/components/general/Heading";
import { PlusCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface CategoriesClientProps {
    data: CategoryColumn[];
}

const Categories: React.FC<CategoriesClientProps> = ({ data }) => {
    const params = useParams();
    const router = useRouter();

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading title={`Categories (${data.length})`} description="Manage categories for your store" />

                <Button onClick={() => router.push(`/${params.storeId}/categories/new`)} variant="secondary" className="w-1/2">
                    <PlusCircle className="mr-2 h-4 w-4 text-sky-600" /> New Category
                </Button>
            </div>
            <Separator />
            <DataTable searchKey="name" columns={columns} data={data} />

            <Heading title="API" description="API Calls for Categories" />
            <Separator />

            <ApiList entityName="categories" entityIdName="categoryId" />
        </>
    );
};

export default Categories;