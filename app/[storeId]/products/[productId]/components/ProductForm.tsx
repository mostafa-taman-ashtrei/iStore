"use client";

import * as z from "zod";

import { Category, Color, Image, Product, Size } from "@prisma/client";
import { CheckCircle2, Loader, Trash, Wand2 } from "lucide-react";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useParams, useRouter } from "next/navigation";

import AlertModal from "@/components/dashboard/AlertModal";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Heading from "@/components/general/Heading";
import ImageUpload from "@/components/dashboard/ImageUpload";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
    name: z.string().min(1, { message: "Enter your product name." }),
    images: z.object({ url: z.string() }).array(),
    price: z.coerce.number().min(1, { message: "Enter your product price." }),
    categoryId: z.string().min(1, { message: "Select a category." }),
    colorId: z.string().min(1, { message: "Select a price." }),
    sizeId: z.string().min(1, { message: "Select a size." }),
    isFeatured: z.boolean().default(false).optional(),
    isArchived: z.boolean().default(false).optional()
});

type ProductFormValues = z.infer<typeof formSchema>

interface ProductFormProps {
    initialData: Product & {
        images: Image[]
    } | null;
    categories: Category[];
    colors: Color[];
    sizes: Size[];
}

const ProductForm: React.FC<ProductFormProps> = ({ initialData, categories, sizes, colors }) => {
    const params = useParams();
    const router = useRouter();
    const { toast } = useToast();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const title = initialData ? "Edit product" : "Create product";
    const description = initialData ? "Edit your product to your liking." : "Add a new product";
    const toastMessage = initialData ? "Product updated." : "Product created.";
    const action = initialData ? "Save changes" : "Create";

    const defaultValues = initialData ? {
        ...initialData,
        price: parseFloat(String(initialData?.price)),
    } : {
        name: "",
        images: [],
        price: 0,
        categoryId: "",
        colorId: "",
        sizeId: "",
        isFeatured: false,
        isArchived: false,
    };

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues
    });

    const onSubmit = async (data: ProductFormValues) => {
        try {
            setLoading(true);
            if (initialData) await axios.patch(`/api/${params.storeId}/products/${params.productId}`, data);
            else await axios.post(`/api/${params.storeId}/products`, data);

            router.refresh();
            router.push(`/${params.storeId}/products`);
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
            await axios.delete(`/api/${params.storeId}/products/${params.productId}`);
            router.refresh();
            router.push(`/${params.storeId}/products`);
            toast({ title: "Product deleted." });
        } catch (error) {
            toast({
                title: "Something went wrong.",
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
                    <FormField
                        control={form.control}
                        name="images"
                        render={({ field }) => (
                            <FormItem>

                                <div className="flex flex-row items-center justify-start gap-4">
                                    <FormLabel>Images</FormLabel>
                                    <FormMessage />
                                </div>

                                <FormControl>
                                    <ImageUpload
                                        value={field.value.map((image) => image.url)}
                                        disabled={loading}
                                        multipleUpload
                                        onChange={(url) => field.onChange([...field.value, { url }])}
                                        onRemove={(url) => field.onChange([...field.value.filter((current) => current.url !== url)])}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <div className="md:grid md:grid-cols-2 gap-4">
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
                                        <Input disabled={loading} placeholder="Product name" {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="flex flex-row items-center justify-start gap-4">
                                        <FormLabel>Price</FormLabel>
                                        <FormMessage />
                                    </div>

                                    <FormControl>
                                        <Input type="number" disabled={loading} placeholder="9.99" {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="categoryId"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="flex flex-row items-center justify-start gap-4">
                                        <FormLabel>Category</FormLabel>
                                        <FormMessage />
                                    </div>

                                    <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue defaultValue={field.value} placeholder="Select a category" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {categories.map((category) => (
                                                <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="sizeId"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="flex flex-row items-center justify-start gap-4">
                                        <FormLabel>Size</FormLabel>
                                        <FormMessage />
                                    </div>

                                    <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue defaultValue={field.value} placeholder="Select a size" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {sizes.map((size) => (
                                                <SelectItem key={size.id} value={size.id}>{size.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="colorId"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="flex flex-row items-center justify-start gap-4">
                                        <FormLabel>Color</FormLabel>
                                        <FormMessage />
                                    </div>

                                    <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue defaultValue={field.value} placeholder="Select a color" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {colors.map((color) => (
                                                <SelectItem key={color.id} value={color.id}>{color.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="isFeatured"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>

                                    <div className="space-y-1 leading-none">
                                        <FormLabel>
                                            Featured
                                        </FormLabel>
                                        <FormDescription className="text-xs">
                                            This product will appear on the home page
                                        </FormDescription>
                                    </div>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="isArchived"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>

                                    <div className="space-y-1 leading-none">
                                        <FormLabel>
                                            Archived
                                        </FormLabel>
                                        <FormDescription className="text-xs">
                                            This product will not appear anywhere in the store.
                                        </FormDescription>
                                    </div>
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

export default ProductForm;