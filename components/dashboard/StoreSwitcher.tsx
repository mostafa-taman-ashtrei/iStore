"use client";

import * as React from "react";

import { CheckCircle2, ChevronsUpDown, PlusCircle, Store } from "lucide-react";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useStoreModal } from "@/hooks/useStoreModal";

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>

interface StoreSwitcherProps extends PopoverTriggerProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    items: Record<string, any>[];
}

export default function StoreSwitcher({ className, items = [] }: StoreSwitcherProps) {
    const storeModal = useStoreModal();
    const params = useParams();
    const router = useRouter();

    const formattedItems = items.map((item) => ({
        label: item.name,
        value: item.id
    }));

    const currentStore = formattedItems.find((item) => item.value === params.storeId);

    const [open, setOpen] = React.useState(false);

    const handleStoreSelect = (store: { value: string, label: string }) => {
        setOpen(false);
        router.push(`/${store.value}`);
    };

    const handleSelect = () => {
        setOpen(false);
        storeModal.onOpen();
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="secondary"
                    size="sm"
                    role="combobox"
                    aria-expanded={open}
                    aria-label="Select a store"
                    className={cn("w-[200px] justify-between mx-1", className)}
                >
                    <Store className="mr-2 h-4 w-4 text-sky-600" />
                    {currentStore?.label}
                    <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandList>
                        <CommandInput placeholder="Search stores ..." />

                        <CommandEmpty>No store found.</CommandEmpty>

                        <CommandGroup heading="Stores">
                            {formattedItems.map((store) => (
                                <CommandItem
                                    key={store.value}
                                    onSelect={() => handleStoreSelect(store)}
                                    className="text-sm cursor-pointer"
                                >
                                    <Store className="mr-2 h-4 w-4 text-sky-600" />

                                    {store.label}

                                    <CheckCircle2
                                        className={cn(
                                            "ml-auto h-4 w-4 text-sky-600",
                                            currentStore?.value === store.value
                                                ? "opacity-100"
                                                : "opacity-0"
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>

                    <CommandSeparator />

                    <CommandList>
                        <CommandGroup>
                            <CommandItem onSelect={handleSelect} className="cursor-pointer">
                                <PlusCircle className="mr-2 h-5 w-5 text-sky-600" />
                                Create Store
                            </CommandItem>
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}