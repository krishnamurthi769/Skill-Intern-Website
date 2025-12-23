import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileSpreadsheet, FileText, Presentation } from "lucide-react";
import { FounderTool } from "@/data/resources";

const Icons = {
    Pitching: Presentation,
    Finance: FileSpreadsheet,
    Legal: FileText,
    Product: FileText // Fallback or specific icon
};

interface FounderToolsProps {
    tools: FounderTool[];
}

export function FounderTools({ tools }: FounderToolsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool) => {
                const Icon = Icons[tool.category] || FileText;
                return (
                    <Card key={tool.id} className="hover:border-primary/50 transition-colors">
                        <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <Icon className="h-6 w-6 text-primary" />
                            </div>
                            <div className="flex-1">
                                <CardTitle className="text-base mb-1">{tool.title}</CardTitle>
                                <CardDescription className="text-xs line-clamp-2">
                                    {tool.description}
                                </CardDescription>
                            </div>
                        </CardHeader>
                        <CardFooter>
                            <Button variant="secondary" size="sm" className="w-full" asChild>
                                <a href={tool.downloadUrl}>
                                    <Download className="mr-2 h-4 w-4" /> Download Template
                                </a>
                            </Button>
                        </CardFooter>
                    </Card>
                );
            })}
        </div>
    );
}
