export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface Account {
  id: string;
  account_code: string;
  name_en: string;
  name_ar: string;
  classification: string;
  sub_classification: string;
  account_type: string;
  parent: string | null;
  is_posting: boolean;
  is_payment_enabled: boolean;
  is_locked: boolean;
  is_system: boolean;
  created_ts: string;
  modified_ts: string;
}

export interface BankAccount {
  id: string;
  name: string;
  account: string;
  currency: string;
  classification: string;
  sub_classification: string;
  created_ts: string;
  modified_ts: string;
}

export interface BillLineItem {
  id: string;
  description: string;
  account: string;
  quantity: number;
  unit_amount: number;
  line_amount: number;
  tax_rate?: string;
  tax_amount: number;
  cost_center?: string;
  item?: string;
  discount?: number | null;
  created_ts: string;
  modified_ts: string;
}

export interface BillDebitNote {
  debit_note: string;
  amount: number;
  date?: string;
}

export interface Bill {
  id: string;
  bill_number: string;
  bill_date: string;
  bill_due_date: string;
  contact?: string;
  currency: string;
  tax_amount_type: string;
  status: string;
  language?: string;
  amount: number;
  balance: number;
  tax_amount: number;
  line_items: BillLineItem[];
  debit_notes?: BillDebitNote[];
  notes?: string;
  reference?: string;
  order_number?: string;
  branch?: string | null;
  project?: string | null;
  exchange_rate?: number | null;
  attachments?: string[];
  created_ts: string;
  modified_ts: string;
}

export interface Expense {
  id: string;
  description: string;
  account: string;
  paid_through_account: string;
  amount: number;
  currency: string;
  date: string;
  tax_rate?: string;
  tax_amount_type: string;
  contact?: string;
  reference?: string;
  branch?: string | null;
  project?: string | null;
  cost_center?: string | null;
  exchange_rate?: number | null;
  attachments?: string[];
  created_ts: string;
  modified_ts: string;
}

export interface InvoiceLineItem {
  id: string;
  description: string;
  account: string;
  quantity: number;
  unit_amount: number;
  line_amount: number;
  tax_rate?: string;
  tax_amount: number;
  cost_center?: string;
  item?: string;
  discount?: number | null;
  created_ts: string;
  modified_ts: string;
}

export interface InvoiceCreditNote {
  credit_note: string;
  amount: number;
  date?: string;
}

export interface Invoice {
  id: string;
  invoice_number: string;
  invoice_date: string;
  invoice_due_date: string;
  contact: string;
  currency: string;
  tax_amount_type: string;
  status: string;
  language?: string;
  amount: number;
  balance: number;
  tax_amount: number;
  line_items: InvoiceLineItem[];
  credit_notes?: InvoiceCreditNote[];
  notes?: string;
  reference?: string;
  purchase_order?: string;
  branch?: string | null;
  project?: string | null;
  warehouse?: string | null;
  place_of_supply?: string;
  discount_amount?: number;
  discount_account?: string;
  discount_tax_rate?: string;
  discount_cost_center?: string;
  exchange_rate?: number | null;
  attachments?: string[];
  created_ts: string;
  modified_ts: string;
}

export interface TrialBalanceTotals {
  debit_to_bcy: number;
  credit_to_bcy: number;
  opening_balance_to_bcy: number;
  running_balance_to_bcy: number;
}

export interface TrialBalanceSectionSummary {
  id: string;
  label: string;
  metadata: Record<string, unknown>;
  sub_totals: TrialBalanceTotals;
}

export interface TrialBalanceSection {
  id: string;
  label: string;
  group: string;
  metadata: Record<string, unknown>;
  children: Record<string, unknown>[];
  summary: TrialBalanceSectionSummary;
}

export interface TrialBalanceOverview {
  id: string;
  label: string;
  count: number;
  from_date: string;
  to_date: string;
  include_zero_balances: boolean;
  with_pnl_openings: boolean;
  filters: Record<string, string[]>;
  created_ts: string;
}

export interface TrialBalanceReportSummary {
  id: string;
  label: string;
  metadata: Record<string, unknown>;
  totals: TrialBalanceTotals;
}

export interface TrialBalanceReport {
  overview: TrialBalanceOverview;
  rows: TrialBalanceSection[];
  summary: TrialBalanceReportSummary;
}
