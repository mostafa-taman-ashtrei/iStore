"use client";

import * as z from "zod";

import { CheckCircle2, Loader, Trash } from "lucide-react";
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
import ApiAlert from "@/components/dashboard/ApiAlert";
import { Button } from "@/components/ui/button";
import Heading from "@/components/general/Heading";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Store } from "@prisma/client";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  name: z.string().min(1, { message: "Enter a store name" }),
});

type SettingsFormValues = z.infer<typeof formSchema>;

interface SettingsFormProps {
  initialData: Store;
}

export const SettingsForm: React.FC<SettingsFormProps> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const onSubmit = async (data: SettingsFormValues) => {
    try {
      setLoading(true);
      await axios.patch(`/api/stores/${params.storeId}`, data);
      router.refresh();
      toast({
        title: "Store Updated Successfully",
        description: "Your store data was updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Failed to update store data",
        description: "Your store data was NOT updated, please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/stores/${params.storeId}`);
      router.refresh();
      router.push("/");

      toast({
        title: "Store Deleted Successfully",
        description: "Your store was deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Failed to delete store.",
        description: "Make sure you removed all products and categories first.",
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
        <Heading
          title="Store settings"
          description="Manage store preferences"
        />

        <Button
          disabled={loading}
          variant="destructive"
          size="sm"
          className="rounded-full"
          onClick={() => setOpen(true)}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>

      <Separator />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full">
                <div className="flex flex-row items-center justify-start gap-4">
                  <FormLabel>Store Name</FormLabel>
                  <FormMessage />
                </div>

                <FormControl>
                  <Input
                    disabled={loading}
                    placeholder="Store name"
                    className="w-full"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <Button
            disabled={loading}
            className="my-2 ml-auto w-full"
            type="submit"
            variant="secondary"
          >
            {loading ? (
              <div className="flex flex-row items-center justify-center gap-1">
                <Loader className="animate-spin text-sky-600" />
                <p className="animate-pulse">Saving Changes</p>
              </div>
            ) : (
              <div className="flex flex-row items-center justify-center gap-1">
                <CheckCircle2 className="h-5 w-5 text-sky-600" />
                <p>Save changes</p>
              </div>
            )}
          </Button>
        </form>
      </Form>

      <Separator />

      <ApiAlert
        title="NEXT_PUBLIC_API_URL"
        variant="public"
        description={`${origin}/api/${params.storeId}`}
      />
    </>
  );
};
