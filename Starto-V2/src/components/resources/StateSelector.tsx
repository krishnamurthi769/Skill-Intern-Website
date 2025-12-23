"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

const states = [
    { value: "karnataka", label: "Karnataka" },
    { value: "telangana", label: "Telangana" },
    { value: "maharashtra", label: "Maharashtra" },
    { value: "tamil-nadu", label: "Tamil Nadu" },
    { value: "kerala", label: "Kerala" },
    { value: "gujarat", label: "Gujarat" },
    { value: "delhi", label: "Delhi" },
    { value: "haryana", label: "Haryana" },
]

interface StateSelectorProps {
    value?: string;
    onValueChange: (value: string) => void;
}

export function StateSelector({ value, onValueChange }: StateSelectorProps) {
    const [open, setOpen] = React.useState(false)

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[200px] justify-between"
                >
                    {value
                        ? states.find((state) => state.label === value)?.label || value
                        : "Select State..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput placeholder="Search state..." />
                    <CommandList>
                        <CommandEmpty>No state found.</CommandEmpty>
                        <CommandGroup>
                            {states.map((state) => (
                                <CommandItem
                                    key={state.value}
                                    value={state.label}
                                    onSelect={(currentValue) => {
                                        onValueChange(currentValue === value ? "" : currentValue)
                                        setOpen(false)
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === state.label ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {state.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
