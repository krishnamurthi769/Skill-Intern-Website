import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { SupportStatus, UserRole } from "@prisma/client"
// @ts-ignore
import nodemailer from "nodemailer"

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || !session.user || !session.user.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await request.json()
        const { subject, message } = body

        // Validation
        if (!subject || !message) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
        }

        if (message.length > 2000) {
            return NextResponse.json({ error: "Message too long (max 2000 characters)" }, { status: 400 })
        }

        // Get Role
        const role = (session.user as any).activeRole || (session.user as any).role || "STARTUP"

        let userRole: UserRole = UserRole.STARTUP
        if (role) {
            const roleUpper = role.toUpperCase()
            if (Object.values(UserRole).includes(roleUpper as UserRole)) {
                userRole = roleUpper as UserRole
            }
        }

        // 1. Save to DB (Optional but good for history)
        const supportRequest = await prisma.supportRequest.create({
            data: {
                userId: session.user.id,
                role: userRole,
                subject,
                message,
                status: SupportStatus.OPEN
            }
        })

        // 2. Send Email (Beta Requirement)
        // Check if we have credentials
        const emailUser = process.env.EMAIL_SERVER_USER
        const emailPass = process.env.EMAIL_SERVER_PASSWORD
        const recipientEmail = "startoindiaoffical@gmail.com"

        if (emailUser && emailPass) {
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: emailUser,
                    pass: emailPass,
                },
            })

            const mailOptions = {
                from: `"Starto Beta Support" <${emailUser}>`,
                to: recipientEmail,
                subject: `[Beta Feedback] ${subject} - ${session.user.name}`,
                text: `
BETA SUPPORT REQUEST
--------------------
User: ${session.user.name} (${session.user.email})
Role: ${role}
User ID: ${session.user.id}

Subject: ${subject}
Message:
${message}
                `,
                html: `
                    <h2>Beta Support Request</h2>
                    <p><strong>User:</strong> ${session.user.name} (${session.user.email})</p>
                    <p><strong>Role:</strong> ${role}</p>
                    <p><strong>Subject:</strong> ${subject}</p>
                    <hr />
                    <h3>Message:</h3>
                    <p style="white-space: pre-wrap;">${message}</p>
                `
            }

            await transporter.sendMail(mailOptions)
            console.log("Support email sent to", recipientEmail)
        } else {
            console.log("No SMTP credentials found. Logging support request:")
            console.log("To:", recipientEmail)
            console.log("Subject:", subject)
            console.log("Message:", message)
            console.log("From:", session.user.email)
        }

        return NextResponse.json({ success: true, data: supportRequest })
    } catch (error) {
        console.error("Error creating support request:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
