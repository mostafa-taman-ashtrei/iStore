import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import prismaDB from "@/lib/prisma";

export const GET = async (req: Request, { params }: { params: { billboardId: string } }) => {
    try {
        if (!params.billboardId) return new NextResponse("Billboard id is required", { status: 400 });

        const billboard = await prismaDB.billboard.findUnique({
            where: { id: params.billboardId }
        });

        return NextResponse.json(billboard);
    } catch (error) {
        return new NextResponse("Internal error", { status: 500 });
    }
};

export const DELETE = async (req: Request, { params }: { params: { billboardId: string, storeId: string } }) => {
    try {
        const { userId } = auth();

        if (!userId) return new NextResponse("Unauthenticated", { status: 403 });
        if (!params.billboardId) return new NextResponse("Billboard id is required", { status: 400 });


        const storeByUserId = await prismaDB.store.findFirst({
            where: { id: params.storeId, userId }
        });

        if (!storeByUserId) return new NextResponse("Unauthorized", { status: 405 });


        const billboard = await prismaDB.billboard.delete({
            where: { id: params.billboardId }
        });

        return NextResponse.json(billboard);
    } catch (error) {
        return new NextResponse("Internal error", { status: 500 });
    }
};


export const PATCH = async (req: Request, { params }: { params: { billboardId: string, storeId: string } }) => {
    try {
        const { userId } = auth();
        const body = await req.json();
        const { label, imageUrl } = body;

        if (!userId) return new NextResponse("Unauthenticated", { status: 403 });
        if (!label) return new NextResponse("Label is required", { status: 400 });
        if (!imageUrl) return new NextResponse("Image URL is required", { status: 400 });


        if (!params.billboardId) return new NextResponse("Billboard id is required", { status: 400 });

        const storeByUserId = await prismaDB.store.findFirst({
            where: { id: params.storeId, userId }
        });

        if (!storeByUserId) return new NextResponse("Unauthorized", { status: 405 });

        const billboard = await prismaDB.billboard.update({
            where: { id: params.billboardId },
            data: { label, imageUrl }
        });

        return NextResponse.json(billboard);
    } catch (error) {
        return new NextResponse("Internal error", { status: 500 });
    }
};