"use client";

import * as z from "zod";

import { Billboard, Category } from "@prisma/client";
import { CheckCircle2, Loader, Trash, Wand2 } from "lucide-react";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useParams, useRouter } from "next/navigation";

import AlertModal from "@/components/dashboard/AlertModal";
import { Button } from "@/components/ui/button";
import Heading from "@/components/general/Heading";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
    name: z.string().min(2, { message: "Enter the name of you category" }),
    billboardId: z.string().min(1, { message: "Add a billboard to your category" }),
});

type CategoryFormValues = z.infer<typeof formSchema>

interface CategoryFormProps {
    initialData: Category | null;
    billboards: Billboard[];
}

const CategoryForm: React.FC<CategoryFormProps> = ({ initialData, billboards }) => {
    const params = useParams();
    const router = useRouter();
    const { toast } = useToast();


    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const title = initialData ? "Edit category" : "Create category";
    const description = initialData ? "Edit your category to your liking." : "Add a new category";
    const toastMessage = initialData ? "Category updated." : "Category created.";
    const action = initialData ? "Save changes" : "Create";

    const form = useForm<CategoryFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            name: "",
            billboardId: "",
        }
    });

    const onSubmit = async (data: CategoryFormValues) => {
        try {
            setLoading(true);
            if (initialData) await axios.patch(`/api/${params.storeId}/categories/${params.categoryId}`, data);
            else await axios.post(`/api/${params.storeId}/categories`, data);

            router.refresh();
            router.push(`/${params.storeId}/categories`);
            toast({ title: toastMessage });
        } catch (error) {
            toast({
                title: "Something went wrong.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const onDelete = async () => {
        try {
            setLoading(true);
            await axios.delete(`/api/${params.storeId}/categories/${params.categoryId}`);
            router.refresh();
            router.push(`/${params.storeId}/categories`);
            toast({ title: "Category deleted." });
        } catch (error) {
            toast({
                title: "Failed to delete Category",
                description:
                    "Make sure you removed all products using this category first.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
            setOpen(false);
        }
    };

    return (
        <>
            <AlertModal
                isOpen={open}
                onClose={() => setOpen(false)}
                onConfirm={onDelete}
                loading={loading}
            />
            <div className="flex items-center justify-between">
                <Heading title={title} description={description} />

                {initialData && (
                    <Button
                        disabled={loading}
                        variant="destructive"
                        size="sm"
                        className="rounded-full"
                        onClick={() => setOpen(true)}
                    >
                        <Trash className="h-4 w-4" />
                    </Button>
                )}
            </div>
            <Separator />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                    <div className="md:grid md:grid-cols-2 gap-8">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="flex flex-row items-center justify-start gap-4">
                                        <FormLabel>Name</FormLabel>
                                        <FormMessage />
                                    </div>

                                    <FormControl>
                                        <Input disabled={loading} placeholder="Category name" {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="billboardId"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="flex flex-row items-center justify-start gap-4">
                                        <FormLabel>Billboard</FormLabel>
                                        <FormMessage />
                                    </div>

                                    <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue defaultValue={field.value} placeholder="Select a billboard" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {billboards.map((billboard) => (
                                                <SelectItem key={billboard.id} value={billboard.id}>{billboard.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button disabled={loading} className="ml-auto w-full" type="submit" variant="secondary">
                        {loading ? (
                            <div className="flex flex-row items-center justify-center gap-1">
                                <Loader className="animate-spin text-sky-600" />
                                <p className="animate-pulse">
                                    {action === "Create"
                                        ? "Creating Category"
                                        : "Saving Changes"}
                                </p>
                            </div>
                        ) : (
                            <div className="flex flex-row items-center justify-center gap-1">
                                {action === "Create" ? (
                                    <Wand2 className="h-5 w-5 text-sky-600" />
                                ) : (
                                    <CheckCircle2 className="h-5 w-5 text-sky-600" />
                                )}

                                <p>{action}</p>
                            </div>
                        )}
                    </Button>
                </form>
            </Form>
        </>
    );
};

export default CategoryForm;