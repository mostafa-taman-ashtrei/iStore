import { NextResponse } from "next/server";
import Stripe from "stripe";
import { headers } from "next/headers";
import prismaDB from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export const POST = async (req: Request) => {
    const body = await req.text();
    const signature = headers().get("Stripe-Signature") as string;

    let event: Stripe.Event;


    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
    }

    const session = event.data.object as Stripe.Checkout.Session;
    const address = session?.customer_details?.address;

    const addressComponents = [
        address?.line1,
        address?.line2,
        address?.city,
        address?.state,
        address?.postal_code,
        address?.country
    ];

    const addressString = addressComponents.filter((c) => c !== null).join(", ");

    if (event.type === "checkout.session.completed") {
        const order = await prismaDB.order.update({
            where: { id: session?.metadata?.orderId },
            data: {
                isPaid: true,
                address: addressString,
                phone: session?.customer_details?.phone || "",
            },
            include: { orderItems: true }
        });

        const productIds = order.orderItems.map((orderItem) => orderItem.productId);

        await prismaDB.product.updateMany({
            where: { id: { in: [...productIds] } },
            data: { isArchived: true }
        });
    }

    return new NextResponse(null, { status: 200 });
};