import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User } from "next-auth"
import React from "react"

interface UserAvatarProps extends React.ComponentPropsWithoutRef<typeof Avatar> {
    user: Pick<User, "image" | "name">
}

export function UserAvatar({ user, ...props }: UserAvatarProps) {
    return (
        <Avatar {...props}>
            {user.image ? (
                <AvatarImage alt="Picture" src={user.image} />
            ) : (
                <AvatarFallback>
                    <span className="sr-only">{user.name}</span>
                    <span>{user.name?.charAt(0)?.toUpperCase()}</span>
                </AvatarFallback>
            )}
        </Avatar>
    )
}
