import { google } from "googleapis";

const auth = new google.auth.GoogleAuth({
    credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY || "{}"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });

export async function addUserToSheet(user: {
    user_id: string;
    name: string;
    email: string;
    role: string;
    signup_date: string;
    city?: string;
    state?: string;
}) {
    if (!process.env.SHEET_ID || !process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
        console.warn("Google Sheets Sync Skipped: Missing Environment Variables");
        return;
    }

    try {
        await sheets.spreadsheets.values.append({
            spreadsheetId: process.env.SHEET_ID!,
            range: "Sheet1!A:I",
            valueInputOption: "RAW",
            requestBody: {
                values: [[
                    user.user_id,
                    user.name,
                    user.email,
                    user.role,
                    user.signup_date,
                    user.city || "",
                    user.state || "",
                    "Website",
                    "Active"
                ]]
            }
        });
    } catch (error) {
        console.error("Google Sheets Sync Failed:", error);
    }
}
