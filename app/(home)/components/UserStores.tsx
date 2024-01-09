import Heading from "@/components/general/Heading";
import PageContainer from "@/components/dashboard/PageContainer";
import { Separator } from "@/components/ui/separator";
import StoreSwitcher from "@/components/dashboard/StoreSwitcher";

interface UserStoresProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    stores: Record<string, any>[];
}

const UserStores: React.FC<UserStoresProps> = ({ stores }) => {
    return (
        <PageContainer>
            <div className="flex flex-col gap-2 justify-center items-center h-screen">
                <Heading
                    title="Welcome back"
                    description="Choose one of your stores to continue or create a new one."
                />

                <Separator />

                <StoreSwitcher items={stores} className="w-1/2" />
            </div>

        </PageContainer>
    );
};

export default UserStores;