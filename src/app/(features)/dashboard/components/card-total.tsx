import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/utils/tailwind/cn";

interface CardTotalProps {
  children?: React.ReactNode;
  title: string;
  value: string;
  note: string;
  trend?: "up" | "down" | "neutral";
  className?: string;
}

export const CardTotal = ({ children, title, value, note, trend = "neutral", className }: CardTotalProps) => {
  return (
    <Card className={cn("border border-border/50 bg-background/80 backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-300", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{title}</CardTitle>
        <div className="p-2 bg-primary/5 rounded-lg text-primary/80 transition-colors group-hover:bg-primary/10">
          {children}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-1">
          <div className="text-3xl font-bold tracking-tight text-foreground">
            {value}
          </div>
          <p className={cn("text-xs font-medium", {
            "text-emerald-500": trend === "up",
            "text-rose-500": trend === "down",
            "text-muted-foreground": trend === "neutral"
          })}>
            {note}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
