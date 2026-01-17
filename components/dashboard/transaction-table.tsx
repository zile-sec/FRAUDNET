import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight, ArrowDownRight, Clock, CheckCircle2, AlertTriangle, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface Transaction {
  id: string
  amount: number
  currency: string
  source_account: string
  destination_account: string
  timestamp: string
  is_fraudulent: boolean | null
}

interface TransactionTableProps {
  transactions: Transaction[]
}

export function TransactionTable({ transactions }: TransactionTableProps) {
  const getStatusConfig = (isFraudulent: boolean | null) => {
    if (isFraudulent === null) {
      return {
        label: "Processing",
        icon: Clock,
        className: "bg-warning/10 text-warning border-warning/20",
      }
    }
    if (isFraudulent) {
      return {
        label: "Fraudulent",
        icon: XCircle,
        className: "bg-destructive/10 text-destructive border-destructive/20",
      }
    }
    return {
      label: "Clear",
      icon: CheckCircle2,
      className: "bg-success/10 text-success border-success/20",
    }
  }

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
    }).format(amount)
  }

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader className="border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-foreground">Recent Transactions</CardTitle>
          <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
            {transactions.length} total
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Transaction ID
                </th>
                <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Amount
                </th>
                <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider hidden md:table-cell">
                  From / To
                </th>
                <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Time
                </th>
                <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {transactions.length > 0 ? (
                transactions.map((tx) => {
                  const status = getStatusConfig(tx.is_fraudulent)
                  const StatusIcon = status.icon
                  return (
                    <tr key={tx.id} className="hover:bg-secondary/20 transition-colors group">
                      <td className="py-4 px-6">
                        <span className="font-mono text-sm text-foreground group-hover:text-primary transition-colors">
                          {tx.id.slice(0, 8)}...
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              "flex items-center justify-center w-6 h-6 rounded-full",
                              tx.amount > 0 ? "bg-success/10" : "bg-destructive/10",
                            )}
                          >
                            {tx.amount > 0 ? (
                              <ArrowDownRight className="w-3 h-3 text-success" />
                            ) : (
                              <ArrowUpRight className="w-3 h-3 text-destructive" />
                            )}
                          </span>
                          <span className="font-medium text-foreground">
                            {formatCurrency(Math.abs(tx.amount), tx.currency)}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6 hidden md:table-cell">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-xs text-muted-foreground">{tx.source_account.slice(0, 12)}...</span>
                          <span className="text-xs text-muted-foreground">
                            → {tx.destination_account.slice(0, 12)}...
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-sm text-muted-foreground">{formatDate(tx.timestamp)}</span>
                      </td>
                      <td className="py-4 px-6">
                        <Badge variant="outline" className={cn("gap-1.5 font-medium", status.className)}>
                          <StatusIcon className="w-3 h-3" />
                          {status.label}
                        </Badge>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={5} className="py-16 px-6">
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-secondary mb-4">
                        <AlertTriangle className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <p className="text-foreground font-medium mb-1">No transactions found</p>
                      <p className="text-sm text-muted-foreground">
                        Waiting for transaction data. Is the backend running?
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
