import { Activity, ShieldCheck, ShieldAlert, Clock } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard/header"
import { StatCard } from "@/components/dashboard/stat-card"
import { TransactionTable } from "@/components/dashboard/transaction-table"
import { buildApiUrl } from "@/lib/api"

// =============================================================================
// TYPES
// =============================================================================

interface Transaction {
  id: string
  amount: number
  currency: string
  source_account: string
  destination_account: string
  timestamp: string
  is_fraudulent: boolean | null
  category?: string
  merchant?: string
  risk_score?: number
}

interface TransactionsResponse {
  data: Transaction[]
  meta: {
    total: number
    fraudulent: number
    clear: number
    processing: number
    timestamp: string
  }
}

// =============================================================================
// DATA FETCHING
// =============================================================================

/**
 * Fetches transactions from the API.
 *
 * Uses buildApiUrl() to construct the correct URL based on environment:
 * - Development: http://localhost:3000/api/transactions
 * - Production (Vercel): https://{VERCEL_URL}/api/transactions
 */
async function getTransactions(): Promise<TransactionsResponse | null> {
  try {
    const url = buildApiUrl("/api/transactions")

    const res = await fetch(url, {
      cache: "no-store",
    })

    if (!res.ok) {
      console.error("Failed to fetch transactions:", res.statusText)
      return null
    }

    return res.json()
  } catch (error) {
    console.error("An error occurred while fetching transactions:", error)
    return null
  }
}

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export default async function HomePage() {
  const response = await getTransactions()

  const transactions = response?.data ?? []
  const meta = response?.meta ?? {
    total: 0,
    fraudulent: 0,
    clear: 0,
    processing: 0,
  }

  const fraudRate = meta.total > 0 ? ((meta.fraudulent / meta.total) * 100).toFixed(1) : "0"

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-6 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Total Transactions"
            value={meta.total}
            subtitle="All time"
            icon={Activity}
            variant="default"
          />
          <StatCard
            title="Clear Transactions"
            value={meta.clear}
            subtitle={`${meta.total > 0 ? ((meta.clear / meta.total) * 100).toFixed(1) : 0}% of total`}
            icon={ShieldCheck}
            variant="success"
          />
          <StatCard
            title="Fraudulent"
            value={meta.fraudulent}
            subtitle={`${fraudRate}% fraud rate`}
            icon={ShieldAlert}
            variant="destructive"
          />
          <StatCard
            title="Processing"
            value={meta.processing}
            subtitle="Awaiting analysis"
            icon={Clock}
            variant="warning"
          />
        </div>

        {/* Transaction Table */}
        <TransactionTable transactions={transactions} />
      </main>
    </div>
  )
}
