"use client";

import { Menu, XIcon } from "lucide-react";
import { useParams, usePathname } from "next/navigation";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { useState } from "react";

const MobileNav: React.FC = () => {
    const [isOpen, setOpen] = useState<boolean>(false);

    const toggleOpen = () => setOpen((prev) => !prev);

    const pathname = usePathname();
    const params = useParams();

    const routes = [
        {
            href: `/${params.storeId}`,
            label: "Overview",
            active: pathname === `/${params.storeId}`,
        },
        {
            href: `/${params.storeId}/billboards`,
            label: "Billboards",
            active: pathname === `/${params.storeId}/billboards`,
        },
        {
            href: `/${params.storeId}/categories`,
            label: "Categories",
            active: pathname === `/${params.storeId}/categories`,
        },
        {
            href: `/${params.storeId}/sizes`,
            label: "Sizes",
            active: pathname === `/${params.storeId}/sizes`,
        },
        {
            href: `/${params.storeId}/colors`,
            label: "Colors",
            active: pathname === `/${params.storeId}/colors`,
        },
        {
            href: `/${params.storeId}/products`,
            label: "Products",
            active: pathname === `/${params.storeId}/products`,
        },
        {
            href: `/${params.storeId}/orders`,
            label: "Orders",
            active: pathname === `/${params.storeId}/orders`,
        },
        {
            href: `/${params.storeId}/settings`,
            label: "Settings",
            active: pathname === `/${params.storeId}/settings`,
        },
    ];

    return (
        <div className="sm:hidden">
            {isOpen ? (
                <XIcon
                    onClick={toggleOpen}
                    className="relative z-50 h-5 w-5 cursor-pointer text-zinc-500"
                />
            ) : (
                <Menu
                    onClick={toggleOpen}
                    className="relative z-50 h-5 w-5 cursor-pointer text-zinc-700"
                />
            )}

            {isOpen && (
                <div className="fixed inset-0 z-0 w-full animate-in fade-in-20 slide-in-from-top-5">
                    <div className="absolute grid w-full gap-3 bg-white px-10 pb-8 pt-20 shadow-xl dark:bg-black">

                        {routes.map((route) => (
                            <Link
                                key={route.href}
                                href={route.href}
                                className={cn(
                                    "text-sm font-medium transition-colors hover:text-primary",
                                    route.active ? "text-black dark:text-white" : "text-muted-foreground"
                                )}
                            >
                                {route.label}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MobileNav;
