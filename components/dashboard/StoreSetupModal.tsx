"use client";

import * as z from "zod";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader, PlusCircle, Wand2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Modal from "@/components/general/Modal";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useStoreModal } from "@/hooks/useStoreModal";
import { useToast } from "../ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
    name: z.string().min(1, { message: "please enter a store name." }),
});

const StoreSetupModal: React.FC = () => {
    const storeModal = useStoreModal();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: ""
        },
    });

    const handleFromSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setLoading(true);
            const response = await axios.post("/api/stores", values);
            window.location.assign(`/${response.data.id}`);
        } catch (error) {
            toast({
                title: "Failed to create store",
                description: "Your store was NOT created, please try again later.",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title="New store"
            description="Create a new store in just a few clicks to get started."
            isOpen={storeModal.isOpen}
            onClose={storeModal.onClose}
            Icon={PlusCircle}
        >
            <div>
                <div className="space-y-2 py-2 pb-4">
                    <div className="space-y-2">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(handleFromSubmit)}>
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Store Name</FormLabel>
                                            <FormControl>
                                                <Input disabled={loading} placeholder="cool store name ..." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="pt-2 flex items-center justify-end w-full">
                                    <Button disabled={loading} type="submit" className="w-full" variant="secondary">
                                        {
                                            loading
                                                ? <div className="flex flex-row gap-1 items-center justify-center">
                                                    <Loader className="animate-spin text-sky-600" />
                                                    <p className="animate-pulse">Creating Your Store</p>
                                                </div>

                                                : <div className="flex flex-row gap-1 items-center justify-center">
                                                    <Wand2 className="text-sky-600 w-5 h-5" />
                                                    <p>Create</p>
                                                </div>
                                        }
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default StoreSetupModal;