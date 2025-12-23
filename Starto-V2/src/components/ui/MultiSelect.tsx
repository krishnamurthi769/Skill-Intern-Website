"use client";

import { useState, useRef, useEffect } from "react";
import { X, Check, ChevronDown } from "lucide-react";

interface MultiSelectProps {
    options: readonly string[]; // Accepts readonly arrays (as const) or regular arrays
    selected: string[];
    onChange: (selected: string[]) => void;
    placeholder?: string;
    label?: string;
    maxSelect?: number;
}

export default function MultiSelect({
    options,
    selected,
    onChange,
    placeholder = "Select items...",
    label,
    maxSelect,
}: MultiSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Close when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleSelection = (item: string) => {
        if (selected.includes(item)) {
            onChange(selected.filter((i) => i !== item));
        } else {
            if (maxSelect && selected.length >= maxSelect) return;
            onChange([...selected, item]);
        }
    };

    const filteredOptions = options.filter((opt) =>
        opt.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="w-full" ref={wrapperRef}>
            {label && <label className="block text-muted-foreground mb-2 text-sm">{label}</label>}
            <div className="relative">
                <div
                    className="w-full text-foreground bg-background border border-input rounded-lg min-h-[48px] p-2 flex flex-wrap gap-2 cursor-pointer focus-within:ring-1 focus-within:ring-primary focus-within:border-primary transition-all"
                    onClick={() => {
                        setIsOpen(true);
                        // Focus on search input when opening
                    }}
                >
                    {selected.length === 0 && (
                        <span className="text-muted-foreground self-center px-2">{placeholder}</span>
                    )}

                    {selected.map((item) => (
                        <span
                            key={item}
                            className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm flex items-center gap-1 hover:bg-primary/30 transition-colors"
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleSelection(item);
                            }}
                        >
                            {item}
                            <X className="w-3 h-3 cursor-pointer" />
                        </span>
                    ))}

                    <input
                        type="text"
                        className="flex-1 bg-transparent outline-none min-w-[80px] p-1 text-sm"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onFocus={() => setIsOpen(true)}
                        placeholder={selected.length === 0 ? "" : ""}
                    />
                    <ChevronDown className={`w-5 h-5 text-muted-foreground absolute right-3 top-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </div>

                {isOpen && (
                    <div className="absolute w-full mt-2 bg-popover border border-border rounded-lg shadow-xl z-50 max-h-[300px] overflow-y-auto">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((opt) => (
                                <div
                                    key={opt}
                                    className={`p-3 cursor-pointer flex items-center justify-between text-sm transition-colors ${selected.includes(opt)
                                            ? "bg-primary/10 text-primary"
                                            : "text-foreground hover:bg-muted"
                                        }`}
                                    onClick={() => toggleSelection(opt)}
                                >
                                    <span>{opt}</span>
                                    {selected.includes(opt) && <Check className="w-4 h-4" />}
                                </div>
                            ))
                        ) : (
                            <div className="p-3 text-muted-foreground text-sm text-center">No results found.</div>
                        )}

                        {/* Custom Entry Option - Keep it strict for now? 
                User Plan said "Validated string arrays". 
                "validated against constants.ts" => implies NO custom entry.
                Strict Enum-like behavior for strings. OK.
            */}
                    </div>
                )}
            </div>
        </div>
    );
}
