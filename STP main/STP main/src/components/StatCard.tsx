import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export function StatCard({ title, value, description, icon: Icon, trend }: StatCardProps) {
  return (
    <Card className="bg-card-minimal border-minimal shadow-minimal glass-minimal hover-minimal animate-fade-in group">
      <CardContent className="p-3">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {Icon && <Icon className="icon-minimal-sm text-muted-foreground/70" />}
              <p className="text-minimal-xs font-medium text-muted-foreground/80 uppercase tracking-wide">
                {title}
              </p>
            </div>
            <div className="text-minimal-lg font-bold text-foreground leading-none">
              {value}
            </div>
          </div>
          {trend && (
            <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full text-minimal-xs font-medium ${
              trend.isPositive 
                ? 'bg-green-500/10 text-green-400' 
                : 'bg-red-500/10 text-red-400'
            }`}>
              <span className="text-xs">{trend.isPositive ? '↗' : '↘'}</span>
              <span>{Math.abs(trend.value)}%</span>
            </div>
          )}
        </div>
        {description && (
          <p className="text-minimal-xs text-muted-foreground/70 leading-relaxed">
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}