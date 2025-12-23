import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ExternalLink, FileText, CheckCircle2, Clock, Globe } from "lucide-react";
import { Scheme } from "@/data/resources";

interface SchemeDetailSheetProps {
    scheme: Scheme;
    children: React.ReactNode;
}

export function SchemeDetailSheet({ scheme, children }: SchemeDetailSheetProps) {
    return (
        <Sheet>
            <SheetTrigger asChild>
                {children}
            </SheetTrigger>
            <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
                <SheetHeader className="mb-6">
                    <div className="flex items-center gap-2 mb-2">
                        <Badge variant={scheme.provider === "Central" ? "default" : "secondary"}>
                            {scheme.provider === "Central" ? "Central Govt" : scheme.state}
                        </Badge>
                        <Badge variant="outline">{scheme.type}</Badge>
                    </div>
                    <SheetTitle className="text-xl">{scheme.name}</SheetTitle>
                    <SheetDescription>
                        Last updated: {scheme.lastUpdated}
                    </SheetDescription>
                </SheetHeader>

                <div className="space-y-6">
                    <section>
                        <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                            <FileText className="h-4 w-4" /> Description
                        </h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            {scheme.description}
                        </p>
                    </section>

                    <section>
                        <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4" /> Eligibility Criteria
                        </h4>
                        <p className="text-sm text-muted-foreground mb-2 font-medium">{scheme.eligibility}</p>
                    </section>

                    {scheme.benefits && (
                        <section>
                            <h4 className="text-sm font-semibold mb-2">Key Benefits</h4>
                            <ul className="list-disc list-outside ml-4 space-y-1">
                                {scheme.benefits.map((benefit, i) => (
                                    <li key={i} className="text-sm text-muted-foreground">{benefit}</li>
                                ))}
                            </ul>
                        </section>
                    )}

                    {scheme.documentsRequired && (
                        <section>
                            <h4 className="text-sm font-semibold mb-2">Required Documents</h4>
                            <ul className="list-disc list-outside ml-4 space-y-1">
                                {scheme.documentsRequired.map((doc, i) => (
                                    <li key={i} className="text-sm text-muted-foreground">{doc}</li>
                                ))}
                            </ul>
                        </section>
                    )}

                    {scheme.applicationProcess && (
                        <section>
                            <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                                <Clock className="h-4 w-4" /> Application Process
                            </h4>
                            <div className="relative pl-4 border-l-2 border-muted space-y-4">
                                {scheme.applicationProcess.map((step, i) => (
                                    <div key={i} className="text-sm">
                                        <span className="text-xs font-bold text-muted-foreground block mb-1">Step {i + 1}</span>
                                        <span className="text-muted-foreground">{step}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    <div className="pt-4 border-t">
                        <Button className="w-full" asChild>
                            <a href={scheme.link} target="_blank" rel="noopener noreferrer">
                                Apply on Official Website <ExternalLink className="ml-2 h-4 w-4" />
                            </a>
                        </Button>
                        <p className="text-xs text-center text-muted-foreground mt-2">
                            You will be redirected to {new URL(scheme.link).hostname}
                        </p>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
