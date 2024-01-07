import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import prismaDB from "@/lib/prisma";

export const GET = async (req: Request, { params }: { params: { sizeId: string } }) => {
    try {
        if (!params.sizeId) return new NextResponse("Size id is required", { status: 400 });


        const size = await prismaDB.size.findUnique({
            where: { id: params.sizeId }
        });

        return NextResponse.json(size);
    } catch (error) {
        return new NextResponse("Internal error", { status: 500 });
    }
};

export const DELETE = async (req: Request, { params }: { params: { sizeId: string, storeId: string } }) => {
    try {
        const { userId } = auth();

        if (!userId) return new NextResponse("Unauthenticated", { status: 403 });
        if (!params.sizeId) return new NextResponse("Size id is required", { status: 400 });


        const storeByUserId = await prismaDB.store.findFirst({
            where: { id: params.storeId, userId }
        });

        if (!storeByUserId) return new NextResponse("Unauthorized", { status: 405 });


        const size = await prismaDB.size.delete({
            where: { id: params.sizeId }
        });

        return NextResponse.json(size);
    } catch (error) {
        return new NextResponse("Internal error", { status: 500 });
    }
};


export const PATCH = async (req: Request, { params }: { params: { sizeId: string, storeId: string } }) => {
    try {
        const { userId } = auth();
        const body = await req.json();
        const { name, value } = body;

        if (!userId) return new NextResponse("Unauthenticated", { status: 403 });
        if (!name) return new NextResponse("Name is required", { status: 400 });
        if (!value) return new NextResponse("Value is required", { status: 400 });
        if (!params.sizeId) return new NextResponse("Size id is required", { status: 400 });


        const storeByUserId = await prismaDB.store.findFirst({
            where: { id: params.storeId, userId }
        });

        if (!storeByUserId) return new NextResponse("Unauthorized", { status: 405 });


        const size = await prismaDB.size.update({
            where: { id: params.sizeId },
            data: { name, value }
        });

        return NextResponse.json(size);
    } catch (error) {
        return new NextResponse("Internal error", { status: 500 });
    }
};