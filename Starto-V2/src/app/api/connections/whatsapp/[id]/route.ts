import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { id: connectionId } = await params; // This is the ST-XXXX ID

        if (!connectionId) {
            return new NextResponse("Missing Connection ID", { status: 400 });
        }

        // Find the connection
        const connection = await prisma.connectionRequest.findUnique({
            where: { connectionId },
            include: {
                fromUser: true,
                toUser: true
            }
        });

        if (!connection) {
            return new NextResponse("Connection Not Found", { status: 404 });
        }

        // Security: Ensure the user is part of this connection
        const isSender = connection.fromUserId === session.user.id;
        const isReceiver = connection.toUserId === session.user.id;

        if (!isSender && !isReceiver) {
            return new NextResponse("Unauthorized Access to Connection", { status: 403 });
        }

        // Determine who we are chatting WITH
        // If I am Sender, I cheat with Receiver.
        // If I am Receiver, I chat with Sender.
        const otherUser = isSender ? connection.toUser : connection.fromUser;

        if (!otherUser.phoneNumber) {
            return new NextResponse("Partner has no phone number connected.", { status: 400 });
        }

        const cleanPhone = otherUser.phoneNumber.replace(/\D/g, '');
        const message = `Hi ${otherUser.name}, connecting via Starto. (Ref: ${connectionId})`;
        const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;

        // Perform Redirect
        return NextResponse.redirect(whatsappUrl);

    } catch (error) {
        console.error("[WHATSAPP_REDIRECT]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
