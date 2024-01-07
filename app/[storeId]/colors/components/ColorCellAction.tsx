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
import { Button } from "@/components/ui/button";
import { ColorColumn } from "./ColorColumns";
import axios from "axios";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

interface ColorCellActionProps {
    data: ColorColumn;
}

export const ColorCellAction: React.FC<ColorCellActionProps> = ({
    data,
}) => {
    const router = useRouter();
    const params = useParams();
    const { toast } = useToast();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const onConfirm = async () => {
        try {
            setLoading(true);
            await axios.delete(`/api/${params.storeId}/colors/${data.id}`);

            toast({ title: "Color deleted." });
            router.refresh();
        } catch (error) {
            toast({
                title: "Unable to delete Size.",
                description: "Make sure you removed all products using this color first.",
                variant: "destructive"
            });
        } finally {
            setOpen(false);
            setLoading(false);
        }
    };

    const onCopy = (id: string) => {
        navigator.clipboard.writeText(id);
        toast({ title: "Color ID copied to clipboard." });
    };

    return (
        <>
            <AlertModal
                isOpen={open}
                onClose={() => setOpen(false)}
                onConfirm={onConfirm}
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
                        onClick={() => onCopy(data.id)}
                        className="cursor-pointer"
                    >
                        <Copy className="mr-2 h-4 w-4" /> Copy Id
                    </DropdownMenuItem>

                    <DropdownMenuItem
                        onClick={() => router.push(`/${params.storeId}/colors/${data.id}`)}
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

export default ColorCellAction;