import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Building2, Globe } from "lucide-react";
import { Scheme } from "@/data/resources";

import { SchemeDetailSheet } from "@/components/resources/SchemeDetailSheet";

interface SchemeCardProps {
    scheme: Scheme;
}

export function SchemeCard({ scheme }: SchemeCardProps) {
    return (
        <SchemeDetailSheet scheme={scheme}>
            <Card className="h-full flex flex-col hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="pb-3">
                    <div className="flex justify-between items-start gap-4">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Badge variant={scheme.provider === "Central" ? "default" : "secondary"} className="text-xs">
                                    {scheme.provider === "Central" ? "Central Govt" : scheme.state}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                    {scheme.type}
                                </Badge>
                            </div>
                            <CardTitle className="text-lg leading-tight mb-1">{scheme.name}</CardTitle>
                            {scheme.amount && (
                                <span className="text-sm font-medium text-green-600 dark:text-green-400">
                                    {scheme.amount}
                                </span>
                            )}
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="flex-1 pb-3">
                    <p className="text-muted-foreground text-sm line-clamp-3 mb-3">
                        {scheme.description}
                    </p>
                    <div className="flex flex-wrap gap-1">
                        {scheme.tags.map((tag) => (
                            <span key={tag} className="text-[10px] px-2 py-1 bg-muted rounded-full text-muted-foreground">
                                {tag}
                            </span>
                        ))}
                    </div>
                </CardContent>
                <CardFooter className="pt-0">
                    <Button className="w-full" variant="outline" size="sm">
                        View Details
                    </Button>
                </CardFooter>
            </Card>
        </SchemeDetailSheet>
    );
}

import { FundingProgram } from "@/data/resources";

interface FundingCardProps {
    program: FundingProgram;
}

export function FundingCard({ program }: FundingCardProps) {
    return (
        <Card className="h-full flex flex-col hover:shadow-md transition-shadow">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <Badge variant="secondary" className="mb-2">
                            {program.type}
                        </Badge>
                        <CardTitle className="text-lg">{program.name}</CardTitle>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                            <Globe className="h-3 w-3 mr-1" />
                            {program.location}
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="flex-1">
                <p className="text-sm text-muted-foreground mb-4">
                    {program.description}
                </p>
                <div className="flex flex-wrap gap-2">
                    {program.focusArea.map(area => (
                        <Badge key={area} variant="outline" className="text-xs">
                            {area}
                        </Badge>
                    ))}
                </div>
            </CardContent>
            <CardFooter>
                <Button className="w-full" asChild>
                    <a href={program.link} target="_blank" rel="noopener noreferrer">
                        Apply Now <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                </Button>
            </CardFooter>
        </Card>
    )
}
