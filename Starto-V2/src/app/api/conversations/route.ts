import { NextResponse } from "next/server";

export async function GET(req: Request) {
    // Schema update: Conversations are deprecated/moved to WhatsApp. 
    // This endpoint is stubbed to pass build.
    return NextResponse.json([]);
}
