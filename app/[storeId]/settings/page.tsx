import PageContainer from "@/components/dashboard/PageContainer";
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
        <PageContainer>
            <SettingsForm initialData={store} />
        </PageContainer>
    );
};

export default SettingsPage;