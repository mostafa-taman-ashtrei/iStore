"use client";

import { Copy, MoreHorizontal, Pencil, Trash } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useParams, useRouter } from "next/navigation";

import AlertModal from "@/components/dashboard/AlertModal";
import { BillboardColumn } from "./BillboardColumns";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

interface BillboardCellActionProps {
    data: BillboardColumn;
}

const BillboardCellAction: React.FC<BillboardCellActionProps> = ({ data }) => {
    const router = useRouter();
    const params = useParams();
    const { toast } = useToast();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleConfirm = async () => {
        try {
            setLoading(true);
            await axios.delete(`/api/${params.storeId}/billboards/${data.id}`);

            toast({ title: "Billboard deleted." });
            router.refresh();
        } catch (error) {
            toast({
                title: "Unable to delete Billboard.",
                description: "Make sure you removed all categories using this billboard first.",
                variant: "destructive"
            });

        } finally {
            setOpen(false);
            setLoading(false);
        }
    };

    const handleCopy = (id: string) => {
        navigator.clipboard.writeText(id);
        toast({ title: "Billboard ID copied to clipboard." });
    };

    return (
        <>
            <AlertModal
                isOpen={open}
                onClose={() => setOpen(false)}
                onConfirm={handleConfirm}
                loading={loading}
            />

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem
                        onClick={() => handleCopy(data.id)}
                        className="cursor-pointer"
                    >
                        <Copy className="mr-2 h-4 w-4" /> Copy Id
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => router.push(`/${params.storeId}/billboards/${data.id}`)}
                        className="cursor-pointer"
                    >
                        <Pencil className="mr-2 h-4 w-4" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => setOpen(true)}
                        className="cursor-pointer"
                    >
                        <Trash className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
};

export default BillboardCellAction;