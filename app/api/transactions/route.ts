import { NextResponse } from "next/server"

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

export interface Transaction {
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

export interface TransactionsResponse {
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
// MOCK DATA
// =============================================================================

const mockTransactions: Transaction[] = [
  {
    id: "txn_001",
    amount: 1250.0,
    currency: "USD",
    source_account: "ACC-7829-4561",
    destination_account: "ACC-3947-8823",
    timestamp: "2024-01-15T09:23:45Z",
    is_fraudulent: false,
    category: "transfer",
    merchant: "Bank Transfer",
    risk_score: 12,
  },
  {
    id: "txn_002",
    amount: 89500.0,
    currency: "USD",
    source_account: "ACC-1122-9988",
    destination_account: "ACC-5566-3344",
    timestamp: "2024-01-15T10:45:12Z",
    is_fraudulent: true,
    category: "wire",
    merchant: "International Wire",
    risk_score: 94,
  },
  {
    id: "txn_003",
    amount: 320.5,
    currency: "USD",
    source_account: "ACC-4455-6677",
    destination_account: "ACC-8899-0011",
    timestamp: "2024-01-15T11:02:33Z",
    is_fraudulent: false,
    category: "purchase",
    merchant: "Amazon",
    risk_score: 8,
  },
  {
    id: "txn_004",
    amount: 15750.0,
    currency: "USD",
    source_account: "ACC-2233-4455",
    destination_account: "ACC-6677-8899",
    timestamp: "2024-01-15T12:18:07Z",
    is_fraudulent: null,
    category: "transfer",
    merchant: "Investment Account",
    risk_score: 45,
  },
  {
    id: "txn_005",
    amount: 42000.0,
    currency: "USD",
    source_account: "ACC-9900-1122",
    destination_account: "ACC-3344-5566",
    timestamp: "2024-01-15T13:45:22Z",
    is_fraudulent: true,
    category: "wire",
    merchant: "Offshore Account",
    risk_score: 89,
  },
  {
    id: "txn_006",
    amount: 875.25,
    currency: "USD",
    source_account: "ACC-7788-9900",
    destination_account: "ACC-1122-3344",
    timestamp: "2024-01-15T14:30:18Z",
    is_fraudulent: false,
    category: "purchase",
    merchant: "Best Buy",
    risk_score: 15,
  },
  {
    id: "txn_007",
    amount: 5600.0,
    currency: "USD",
    source_account: "ACC-5544-3322",
    destination_account: "ACC-9988-7766",
    timestamp: "2024-01-15T15:12:45Z",
    is_fraudulent: null,
    category: "transfer",
    merchant: "Savings Account",
    risk_score: 38,
  },
  {
    id: "txn_008",
    amount: 125.0,
    currency: "USD",
    source_account: "ACC-1100-2233",
    destination_account: "ACC-4455-6688",
    timestamp: "2024-01-15T16:05:33Z",
    is_fraudulent: false,
    category: "purchase",
    merchant: "Starbucks",
    risk_score: 5,
  },
  {
    id: "txn_009",
    amount: 67890.0,
    currency: "USD",
    source_account: "ACC-8877-6655",
    destination_account: "ACC-4433-2211",
    timestamp: "2024-01-15T17:22:11Z",
    is_fraudulent: true,
    category: "wire",
    merchant: "Unknown Recipient",
    risk_score: 97,
  },
  {
    id: "txn_010",
    amount: 2340.75,
    currency: "USD",
    source_account: "ACC-0099-8877",
    destination_account: "ACC-6655-4433",
    timestamp: "2024-01-15T18:45:59Z",
    is_fraudulent: false,
    category: "purchase",
    merchant: "Apple Store",
    risk_score: 18,
  },
  {
    id: "txn_011",
    amount: 9800.0,
    currency: "USD",
    source_account: "ACC-2211-0099",
    destination_account: "ACC-8877-6655",
    timestamp: "2024-01-15T19:33:27Z",
    is_fraudulent: null,
    category: "transfer",
    merchant: "Brokerage Account",
    risk_score: 52,
  },
  {
    id: "txn_012",
    amount: 450.0,
    currency: "USD",
    source_account: "ACC-4433-2200",
    destination_account: "ACC-1199-8877",
    timestamp: "2024-01-15T20:15:44Z",
    is_fraudulent: false,
    category: "purchase",
    merchant: "Target",
    risk_score: 10,
  },
]

// =============================================================================
// API HANDLERS
// =============================================================================

export async function GET() {
  // Calculate metadata
  const fraudulent = mockTransactions.filter((tx) => tx.is_fraudulent === true).length
  const clear = mockTransactions.filter((tx) => tx.is_fraudulent === false).length
  const processing = mockTransactions.filter((tx) => tx.is_fraudulent === null).length

  const response: TransactionsResponse = {
    data: mockTransactions,
    meta: {
      total: mockTransactions.length,
      fraudulent,
      clear,
      processing,
      timestamp: new Date().toISOString(),
    },
  }

  return NextResponse.json(response)
}
