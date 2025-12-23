import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { ShieldAlert } from "lucide-react";

export default function UnauthorizedPage() {
    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-background p-4">
            <Card className="w-full max-w-md border-destructive/20 shadow-lg">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
                        <ShieldAlert className="h-8 w-8 text-destructive" />
                    </div>
                    <CardTitle className="text-2xl font-bold">Access Denied</CardTitle>
                    <CardDescription className="text-base">
                        You do not have permission to view this page. This area is restricted to users with different privileges.
                    </CardDescription>
                </CardHeader>
                <CardContent className="text-center text-muted-foreground">
                    <p>
                        Please sign in with an account that has access to this resource, or return to the dashboard.
                    </p>
                </CardContent>
                <CardFooter className="flex justify-center gap-4">
                    <Button variant="outline" asChild>
                        <Link href="/">
                            Return Home
                        </Link>
                    </Button>
                    <Button asChild>
                        <Link href="/login">
                            Sign In
                        </Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
