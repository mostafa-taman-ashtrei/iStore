"use client";

import * as z from "zod";

import { CheckCircle2, Loader, Trash, Wand2 } from "lucide-react";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { useParams, useRouter } from "next/navigation";

import AlertModal from "@/components/dashboard/AlertModal";
import { Button } from "@/components/ui/button";
import { Color } from "@prisma/client";
import Heading from "@/components/general/Heading";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
    name: z.string().min(2, { message: "Enter your color name." }),
    value: z.string()
        .min(4, { message: "Your hex value must have at least 4 chatacters" })
        .max(9, { message: "Your hex value must have no more than 9 chatacters" }).regex(/^#/, {
            message: "The Value must be a valid hex code"
        }),
});

type ColorFormValues = z.infer<typeof formSchema>

interface ColorFormProps {
    initialData: Color | null;
}

export const ColorForm: React.FC<ColorFormProps> = ({
    initialData
}) => {
    const params = useParams();
    const router = useRouter();
    const { toast } = useToast();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const title = initialData ? "Edit color" : "Create color";
    const description = initialData ? "Edit your color to your liking." : "Add a new color";
    const toastMessage = initialData ? "Color updated." : "Color created.";
    const action = initialData ? "Save changes" : "Create";

    const form = useForm<ColorFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            name: ""
        }
    });

    const onSubmit = async (data: ColorFormValues) => {
        try {
            setLoading(true);
            if (initialData) await axios.patch(`/api/${params.storeId}/colors/${params.colorId}`, data);
            else await axios.post(`/api/${params.storeId}/colors`, data);

            router.refresh();
            router.push(`/${params.storeId}/colors`);
            toast({ title: toastMessage });
        } catch (error) {
            toast({ title: "Something Went Wrong", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const onDelete = async () => {
        try {
            setLoading(true);
            await axios.delete(`/api/${params.storeId}/colors/${params.colorId}`);
            router.refresh();
            router.push(`/${params.storeId}/colors`);
            toast({ title: "Color deleted." });
        } catch (error) {
            toast({
                title: "Failed to delete Color",
                description:
                    "Make sure you removed all products using this color first.",
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
                                        <Input disabled={loading} placeholder="Color name" {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="value"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="flex flex-row items-center justify-start gap-4">
                                        <FormLabel>Hex Value</FormLabel>
                                        <FormMessage />
                                    </div>

                                    <FormControl>
                                        <div className="flex items-center gap-x-4">
                                            <Input disabled={loading} placeholder="Color value" {...field} />
                                            <div
                                                className="border p-4 rounded-full"
                                                style={{ backgroundColor: field.value }}
                                            />
                                        </div>
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>

                    <Button disabled={loading} className="ml-auto w-full" type="submit" variant="secondary">
                        {loading ? (
                            <div className="flex flex-row items-center justify-center gap-1">
                                <Loader className="animate-spin text-sky-600" />
                                <p className="animate-pulse">
                                    {action === "Create" ? "Creating Color" : "Saving Changes"}
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

export default ColorForm;