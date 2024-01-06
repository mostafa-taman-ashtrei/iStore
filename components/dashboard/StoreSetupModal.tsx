"use client";

import * as z from "zod";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Modal from "@/components/general/Modal";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useStoreModal } from "@/hooks/useStoreModal";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
    name: z.string().min(1, { message: "please enter a store name." }),
});

const StoreSetupModal: React.FC = () => {
    const storeModal = useStoreModal();
    const [loading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: ""
        },
    });

    return (
        <Modal
            title="Create a store"
            description="Create a new store in just a few clicks to get started."
            isOpen={storeModal.isOpen}
            onClose={storeModal.onClose}
        >
            <div>
                <div className="space-y-4 py-2 pb-4">
                    <div className="space-y-2">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(() => { })}>
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

                                <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                                    <Button disabled={loading} variant="outline" onClick={storeModal.onClose}>
                                        Cancel
                                    </Button>
                                    <Button disabled={loading} type="submit">Continue</Button>
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