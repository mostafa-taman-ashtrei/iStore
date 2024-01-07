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
import { Billboard } from "@prisma/client";
import { Button } from "@/components/ui/button";
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
  label: z
    .string()
    .min(1, { message: "Please enter a label for you billboard" }),
  imageUrl: z
    .string()
    .min(1, { message: "Please select an image for new billboard" }),
});

type BillboardFormValues = z.infer<typeof formSchema>;

interface BillboardFormProps {
  initialData: Billboard | null;
}

const BillboardForm: React.FC<BillboardFormProps> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? "Edit billboard" : "Add a new billboard";
  const description = initialData
    ? "Edit your billboard to your liking."
    : "Create a new billboard";
  const toastMessage = initialData
    ? "Billboard updated."
    : "Billboard created.";
  const action = initialData ? "Save changes" : "Create";

  const form = useForm<BillboardFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      label: "",
      imageUrl: "",
    },
  });

  const onSubmit = async (data: BillboardFormValues) => {
    try {
      setLoading(true);

      if (initialData)
        await axios.patch(
          `/api/${params.storeId}/billboards/${params.billboardId}`,
          data
        );
      else await axios.post(`/api/${params.storeId}/billboards`, data);

      router.refresh();
      router.push(`/${params.storeId}/billboards`);

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
      await axios.delete(
        `/api/${params.storeId}/billboards/${params.billboardId}`
      );
      router.refresh();
      router.push(`/${params.storeId}/billboards`);

      toast({ title: "Billboard deleted." });
    } catch (error) {
      toast({
        title: "Failed to delete Billboard",
        description:
          "Make sure you removed all categories using this billboard first.",
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
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-8"
        >
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <div className="flex flex-row items-center justify-start gap-4">
                  <FormLabel>Background image</FormLabel>
                  <FormMessage />
                </div>

                <FormControl>
                  <ImageUpload
                    value={field.value ? [field.value] : []}
                    disabled={loading}
                    onChange={(url) => field.onChange(url)}
                    onRemove={() => field.onChange("")}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="label"
            render={({ field }) => (
              <FormItem>
                <div className="flex flex-row items-center justify-start gap-4">
                  <FormLabel>Label</FormLabel>
                  <FormMessage />
                </div>

                <FormControl>
                  <Input
                    disabled={loading}
                    placeholder="Billboard label"
                    className="w-full"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <Button
            disabled={loading}
            className="ml-auto w-full"
            variant="secondary"
            type="submit"
          >
            {loading ? (
              <div className="flex flex-row items-center justify-center gap-1">
                <Loader className="animate-spin text-sky-600" />
                <p className="animate-pulse">
                  {action === "Create"
                    ? "Creating Billboard"
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

export default BillboardForm;
