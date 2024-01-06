import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import prismaDB from "@/lib/prisma";

export const POST = async (req: Request, { params }: { params: { storeId: string } }) => {
    try {
        const { userId } = auth();
        const body = await req.json();
        const { label, imageUrl } = body;

        if (!userId) return new NextResponse("Unauthenticated", { status: 403 });
        if (!label) return new NextResponse("Label is required", { status: 400 });
        if (!imageUrl) return new NextResponse("Image URL is required", { status: 400 });
        if (!params.storeId) return new NextResponse("Store id is required", { status: 400 });


        const storeByUserId = await prismaDB.store.findFirst({
            where: { id: params.storeId, userId }
        });

        if (!storeByUserId) return new NextResponse("Unauthorized", { status: 405 });

        const billboard = await prismaDB.billboard.create({
            data: {
                label,
                imageUrl,
                storeId: params.storeId,
            }
        });

        return NextResponse.json(billboard);
    } catch (error) {
        return new NextResponse("Internal error", { status: 500 });
    }
};

export const GET = async (req: Request, { params }: { params: { storeId: string } }) => {
    try {
        if (!params.storeId) return new NextResponse("Store id is required", { status: 400 });

        const billboards = await prismaDB.billboard.findMany({
            where: { storeId: params.storeId }
        });

        return NextResponse.json(billboards);
    } catch (error) {
        return new NextResponse("Internal error", { status: 500 });
    }
};