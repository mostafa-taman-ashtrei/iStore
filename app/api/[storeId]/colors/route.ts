import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import prismaDB from "@/lib/prisma";

export const POST = async (req: Request, { params }: { params: { storeId: string } }) => {
    try {
        const { userId } = auth();
        const body = await req.json();
        const { name, value } = body;

        if (!userId) return new NextResponse("Unauthenticated", { status: 403 });
        if (!name) return new NextResponse("Name is required", { status: 400 });
        if (!value) return new NextResponse("Value is required", { status: 400 });
        if (!params.storeId) return new NextResponse("Store id is required", { status: 400 });


        const storeByUserId = await prismaDB.store.findFirst({
            where: { id: params.storeId, userId }
        });

        if (!storeByUserId) return new NextResponse("Unauthorized", { status: 405 });

        const color = await prismaDB.color.create({
            data: { name, value, storeId: params.storeId }
        });

        return NextResponse.json(color);
    } catch (error) {
        return new NextResponse("Internal error", { status: 500 });
    }
};

export const GET = async (req: Request, { params }: { params: { storeId: string } }) => {
    try {
        if (!params.storeId) return new NextResponse("Store id is required", { status: 400 });

        const colors = await prismaDB.color.findMany({
            where: { storeId: params.storeId }
        });

        return NextResponse.json(colors);
    } catch (error) {
        return new NextResponse("Internal error", { status: 500 });
    }
};