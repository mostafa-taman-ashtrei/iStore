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
import Heading from "@/components/general/Heading";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Size } from "@prisma/client";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  name: z.string().min(1, { message: "Enter the name of your size." }),
  value: z.string().min(1, { message: "Enter the value of of your size." }),
});

type SizeFormValues = z.infer<typeof formSchema>;

interface SizeFormProps {
  initialData: Size | null;
}

const SizeForm: React.FC<SizeFormProps> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? "Edit size" : "Create size";
  const description = initialData
    ? "Edit your size to your liking."
    : "Add a new size";
  const toastMessage = initialData ? "Size updated." : "Size created.";
  const action = initialData ? "Save changes" : "Create";

  const form = useForm<SizeFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
    },
  });

  const onSubmit = async (data: SizeFormValues) => {
    try {
      setLoading(true);
      if (initialData)
        await axios.patch(
          `/api/${params.storeId}/sizes/${params.sizeId}`,
          data
        );
      else await axios.post(`/api/${params.storeId}/sizes`, data);

      router.refresh();
      router.push(`/${params.storeId}/sizes`);
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
      await axios.delete(`/api/${params.storeId}/sizes/${params.sizeId}`);
      router.refresh();
      router.push(`/${params.storeId}/sizes`);
      toast({ title: "Size deleted." });
    } catch (error) {
      toast({
        title: "Failed to delete Billboard",
        description:
          "Make sure you removed all products using this size first.",
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
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-8"
        >
          <div className="gap-8 md:grid md:grid-cols-2">
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
                    <Input
                      disabled={loading}
                      placeholder="Size name"
                      {...field}
                    />
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
                    <FormLabel>Value</FormLabel>
                    <FormMessage />
                  </div>

                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Size value"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <Button
            disabled={loading}
            className="ml-auto w-full"
            type="submit"
            variant="secondary"
          >
            {loading ? (
              <div className="flex flex-row items-center justify-center gap-1">
                <Loader className="animate-spin text-sky-600" />
                <p className="animate-pulse">
                  {action === "Create" ? "Creating Category" : "Saving Changes"}
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

export default SizeForm;
