import { Badge } from "@/components/ui/badge"
import { UserRole } from "@/types/starto"
import { roleLabels } from "@/config/roles"

const roleColors: Record<UserRole, "default" | "secondary" | "destructive" | "outline"> = {
    admin: "destructive",
    freelancer: "secondary",
    investor: "default",
    startup: "outline",
    provider: "secondary"
}

interface RoleBadgeProps {
    role: UserRole
}

export function RoleBadge({ role }: RoleBadgeProps) {
    return (
        <Badge variant={roleColors[role]}>{roleLabels[role]}</Badge>
    )
}
