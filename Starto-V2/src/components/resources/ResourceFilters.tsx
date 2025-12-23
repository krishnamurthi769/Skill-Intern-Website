import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, X } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface ResourceFiltersProps {
    searchQuery: string;
    onSearchChange: (value: string) => void;
    selectedSector: string;
    onSectorChange: (value: string) => void;
    selectedStage: string;
    onStageChange: (value: string) => void;
    onClearFilters: () => void;
}

export function ResourceFilters({
    searchQuery,
    onSearchChange,
    selectedSector,
    onSectorChange,
    selectedStage,
    onStageChange,
    onClearFilters
}: ResourceFiltersProps) {
    const hasFilters = selectedSector !== "all" || selectedStage !== "all" || searchQuery !== "";

    return (
        <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10 py-4 mb-6 border-b">
            <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search schemes, grants, or tools..."
                        className="pl-8 w-full"
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>
                <div className="flex w-full md:w-auto gap-2 overflow-x-auto pb-2 md:pb-0">
                    <Select value={selectedSector} onValueChange={onSectorChange}>
                        <SelectTrigger className="w-[160px]">
                            <SelectValue placeholder="Sector" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Sectors</SelectItem>
                            <SelectItem value="AI">AI & DeepTech</SelectItem>
                            <SelectItem value="Fintech">Fintech</SelectItem>
                            <SelectItem value="AgriTech">AgriTech</SelectItem>
                            <SelectItem value="HealthTech">HealthTech</SelectItem>
                            <SelectItem value="EdTech">EdTech</SelectItem>
                            <SelectItem value="Retail">Retail</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={selectedStage} onValueChange={onStageChange}>
                        <SelectTrigger className="w-[160px]">
                            <SelectValue placeholder="Funding Stage" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Any Stage</SelectItem>
                            <SelectItem value="Idea">Idea Stage</SelectItem>
                            <SelectItem value="MVP">MVP / Prototype</SelectItem>
                            <SelectItem value="Seed">Seed Stage</SelectItem>
                            <SelectItem value="Growth">Growth Stage</SelectItem>
                        </SelectContent>
                    </Select>

                    {hasFilters && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onClearFilters}
                            title="Clear Filters"
                            className="shrink-0"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
