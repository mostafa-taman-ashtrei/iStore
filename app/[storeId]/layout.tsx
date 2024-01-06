import DashboardNavbar from "@/components/nav/DashboardNavbar";
import { auth } from "@clerk/nextjs";
import prismaDB from "@/lib/prisma";
import { redirect } from "next/navigation";

interface DashboardLayoutProps {
  children: React.ReactNode;
  params: { storeId: string };
}

const DashboardLayout: React.FC<DashboardLayoutProps> = async ({
  children,
  params,
}) => {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const store = await prismaDB.store.findFirst({
    where: { id: params.storeId, userId },
  });

  if (!store) {
    redirect("/");
  }

  return (
    <>
      <DashboardNavbar />
      {children}
    </>
  );
};

export default DashboardLayout;
