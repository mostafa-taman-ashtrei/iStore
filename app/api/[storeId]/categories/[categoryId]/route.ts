import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import prismaDB from "@/lib/prisma";

export const GET = async (req: Request, { params }: { params: { categoryId: string } }) => {
    try {
        if (!params.categoryId) return new NextResponse("Category id is required", { status: 400 });

        const category = await prismaDB.category.findUnique({
            where: { id: params.categoryId },
            include: { billboard: true }
        });

        return NextResponse.json(category);
    } catch (error) {
        return new NextResponse("Internal error", { status: 500 });
    }
};

export const DELETE = async (req: Request, { params }: { params: { categoryId: string, storeId: string } }) => {
    try {
        const { userId } = auth();

        if (!userId) return new NextResponse("Unauthenticated", { status: 403 });
        if (!params.categoryId) return new NextResponse("Category id is required", { status: 400 });


        const storeByUserId = await prismaDB.store.findFirst({
            where: { id: params.storeId, userId }
        });

        if (!storeByUserId) return new NextResponse("Unauthorized", { status: 405 });

        const category = await prismaDB.category.delete({
            where: { id: params.categoryId }
        });

        return NextResponse.json(category);
    } catch (error) {
        return new NextResponse("Internal error", { status: 500 });
    }
};


export const PATCH = async (req: Request, { params }: { params: { categoryId: string, storeId: string } }) => {
    try {
        const { userId } = auth();
        const body = await req.json();
        const { name, billboardId } = body;

        if (!userId) return new NextResponse("Unauthenticated", { status: 403 });
        if (!billboardId) return new NextResponse("Billboard ID is required", { status: 400 });
        if (!name) return new NextResponse("Name is required", { status: 400 });
        if (!params.categoryId) return new NextResponse("Category id is required", { status: 400 });


        const storeByUserId = await prismaDB.store.findFirst({
            where: { id: params.storeId, userId }
        });

        if (!storeByUserId) return new NextResponse("Unauthorized", { status: 405 });

        const category = await prismaDB.category.update({
            where: { id: params.categoryId },
            data: { name, billboardId }
        });

        return NextResponse.json(category);
    } catch (error) {
        return new NextResponse("Internal error", { status: 500 });
    }
};