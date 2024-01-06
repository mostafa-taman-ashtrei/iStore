import MobileNav from "./MobileNav";
import NavRoutes from "./NavRoutes";
import StoreSwitcher from "../dashboard/StoreSwitcher";
import ThemeTogglerButton from "./ThemeTogglerButton";
import UserProfileImage from "../general/UserProfileImage";
import { auth } from "@clerk/nextjs";
import prismaDB from "@/lib/prisma";
import { redirect } from "next/navigation";

const DashboardNavbar: React.FC = async () => {
    const { userId } = auth();
    if (!userId) redirect("/sign-in");

    const stores = await prismaDB.store.findMany({
        where: { userId }
    });

    return (
        <div className="border-b">
            <div className="flex h-16 items-center px-4">

                <MobileNav />
                <NavRoutes className="mx-6" />
                <StoreSwitcher items={stores} />

                <div className="ml-auto flex items-center space-x-4">
                    <UserProfileImage />
                    <ThemeTogglerButton />
                </div>
            </div>
        </div>
    );
};

export default DashboardNavbar;