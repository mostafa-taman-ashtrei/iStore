import NoStores from "./components/NoStores";
import UserStores from "./components/UserStores";
import { auth } from "@clerk/nextjs";
import prismaDB from "@/lib/prisma";
import { redirect } from "next/navigation";

const HomePage: React.FC = async () => {
  const { userId } = auth();
  if (!userId) redirect("/sign-in");

  const stores = await prismaDB.store.findMany({
    where: { userId }
  });

  if (!stores || stores.length === 0) return <NoStores />;
  return <UserStores stores={stores} />;
};

export default HomePage;
