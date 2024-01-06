import { SettingsForm } from "./components/SettingsForm";
import { auth } from "@clerk/nextjs";
import prismaDB from "@/lib/prisma";
import { redirect } from "next/navigation";

interface SettingsPageProps {
    params: { storeId: string }

}

const SettingsPage: React.FC<SettingsPageProps> = async ({ params }) => {
    const { userId } = auth();
    if (!userId) redirect("/sign-in");


    const store = await prismaDB.store.findFirst({
        where: { id: params.storeId, userId }
    });

    if (!store) redirect("/");


    return (
        <div className="flex-1 space-y-4 px-4 lg:px-60 items-center justify-center pt-6">
            <SettingsForm initialData={store} />
        </div>
    );
};

export default SettingsPage;