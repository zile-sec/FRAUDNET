import type { LucideIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
  }
  variant?: "default" | "success" | "destructive" | "warning"
}

export function StatCard({ title, value, subtitle, icon: Icon, trend, variant = "default" }: StatCardProps) {
  const variantStyles = {
    default: "text-primary",
    success: "text-success",
    destructive: "text-destructive",
    warning: "text-warning",
  }

  const bgStyles = {
    default: "bg-primary/10 border-primary/20",
    success: "bg-success/10 border-success/20",
    destructive: "bg-destructive/10 border-destructive/20",
    warning: "bg-warning/10 border-warning/20",
  }

  return (
    <Card className="bg-card border-border hover:border-primary/30 transition-colors">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold text-foreground">{value}</p>
            {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
            {trend && (
              <p className={cn("text-xs font-medium", trend.isPositive ? "text-success" : "text-destructive")}>
                {trend.isPositive ? "+" : ""}
                {trend.value}% from last period
              </p>
            )}
          </div>
          <div className={cn("flex items-center justify-center w-12 h-12 rounded-lg border", bgStyles[variant])}>
            <Icon className={cn("w-6 h-6", variantStyles[variant])} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
