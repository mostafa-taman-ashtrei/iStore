import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge, BadgeProps } from "@/components/ui/badge";
import { Copy, Server } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useToast } from "../ui/use-toast";

interface ApiAlertProps {
    title: string;
    description: string;
    variant: "public" | "admin",
}


const textMap: Record<ApiAlertProps["variant"], string> = {
    public: "Public",
    admin: "Admin"
};

const variantMap: Record<ApiAlertProps["variant"], BadgeProps["variant"]> = {
    public: "secondary",
    admin: "destructive"
};

const ApiAlert: React.FC<ApiAlertProps> = ({ title, description, variant = "public" }) => {
    const { toast } = useToast();

    const onCopy = (description: string) => {
        navigator.clipboard.writeText(description);
        toast({ title: "API Route copied to clipboard." });
    };

    return (
        <Alert>
            <Server className="h-4 w-4" />
            <AlertTitle className="flex items-center gap-x-2">
                {title}
                <Badge variant={variantMap[variant]}>
                    {textMap[variant]}
                </Badge>
            </AlertTitle>
            <AlertDescription className="mt-4 flex items-center justify-between">
                <code className="relative rounded bg-secondary px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                    {description}
                </code>
                <Button variant="outline" className="rounded-full" size="sm" onClick={() => onCopy(description)}>
                    <Copy className="h-4 w-4" />
                </Button>
            </AlertDescription>
        </Alert>
    );
};

export default ApiAlert;