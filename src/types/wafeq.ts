export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface CursorPaginatedResponse<T> {
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

// --- Profit & Loss Report ---

export interface ProfitLossRowSummary {
  id: string;
  label: string;
  metadata: Record<string, unknown>;
  sub_totals: number[];
}

export interface ProfitLossRow {
  id: string;
  label: string;
  metadata: Record<string, unknown>;
  children: ProfitLossRow[];
  summary: ProfitLossRowSummary;
  values: number[];
}

export interface ProfitLossSection {
  id: string;
  label: string;
  group: string;
  metadata: Record<string, unknown>;
  children: ProfitLossRow[];
  summary: ProfitLossRowSummary;
}

export interface ProfitLossColumn {
  id: string;
  label: string;
  metadata: Record<string, string>;
}

export interface ProfitLossOverview {
  id: string;
  label: string;
  currency: string;
  date_from: string;
  date_to: string;
  group_by: string;
  filters: Record<string, string[]>;
  created_ts: string;
}

export interface ProfitLossReport {
  overview: ProfitLossOverview;
  columns: ProfitLossColumn[];
  rows: ProfitLossSection[];
}

// --- Balance Sheet Report ---

export interface BalanceSheetRowSummary {
  id: string;
  label: string;
  metadata: Record<string, unknown>;
  sub_totals: number[];
}

export interface BalanceSheetRow {
  id: string;
  label: string;
  metadata: Record<string, unknown>;
  children: BalanceSheetRow[];
  summary: BalanceSheetRowSummary;
  values: number[];
}

export interface BalanceSheetSubsection {
  id: string;
  label: string;
  group: string;
  metadata: Record<string, unknown>;
  children: BalanceSheetRow[];
  summary: BalanceSheetRowSummary;
}

export interface BalanceSheetSection {
  id: string;
  label: string;
  group: string;
  metadata: Record<string, unknown>;
  children: BalanceSheetSubsection[];
  summary: BalanceSheetRowSummary;
}

export interface BalanceSheetColumn {
  id: string;
  label: string;
  metadata: Record<string, string>;
}

export interface BalanceSheetOverview {
  id: string;
  label: string;
  currency: string;
  date: string;
  group_by: string;
  period_count: number;
  filters: Record<string, string[]>;
  created_ts: string;
}

export interface BalanceSheetReport {
  overview: BalanceSheetOverview;
  columns: BalanceSheetColumn[];
  rows: BalanceSheetSection[];
}

// --- Payments ---

export interface InvoicePayment {
  invoice: string;
  amount: number;
  amount_to_pcy: number;
  created_ts: string;
  modified_ts: string;
}

export interface BillPayment {
  bill: string;
  amount: number;
  amount_to_pcy: number;
  created_ts: string;
  modified_ts: string;
}

export interface CreditNotePayment {
  credit_note: string;
  amount: number;
  amount_to_pcy: number;
  created_ts: string;
  modified_ts: string;
}

export interface DebitNotePayment {
  debit_note: string;
  amount: number;
  amount_to_pcy: number;
  created_ts: string;
  modified_ts: string;
}

export interface Payment {
  id: string;
  amount: number;
  currency: string;
  date: string;
  contact: string;
  paid_through_account: string;
  payment_fees: number;
  payment_fees_account?: string | null;
  reference?: string;
  project?: string | null;
  cost_center?: string | null;
  employee?: string;
  payment_request?: string;
  invoice_payments: InvoicePayment[];
  bill_payments: BillPayment[];
  credit_note_payments: CreditNotePayment[];
  debit_note_payments: DebitNotePayment[];
  created_ts: string;
  modified_ts: string;
}

// --- Credit Notes ---

export interface CreditNoteLineItem {
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

export interface CreditNote {
  id: string;
  credit_note_number: string;
  credit_note_date: string;
  contact: string;
  currency: string;
  tax_amount_type: string;
  status: string;
  language?: string;
  amount: number;
  balance: number;
  tax_amount: number;
  line_items: CreditNoteLineItem[];
  notes?: string;
  reference?: string;
  branch?: string | null;
  project?: string | null;
  warehouse?: string | null;
  place_of_supply?: string;
  discount_cost_center?: string;
  exchange_rate?: number | null;
  attachments?: string[];
  created_ts: string;
  modified_ts: string;
}

// --- Debit Notes ---

export interface DebitNoteLineItem {
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

export interface DebitNote {
  id: string;
  debit_note_number: string;
  debit_note_date: string;
  contact: string;
  currency: string;
  tax_amount_type: string;
  status: string;
  amount: number;
  balance: number;
  tax_amount: number;
  line_items: DebitNoteLineItem[];
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

// --- Contacts ---

export interface CompanyIdentification {
  type: string;
  value: string;
}

export interface Contact {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  district?: string;
  building_number?: string;
  additional_number?: string;
  postal_code?: string;
  country?: string;
  code?: string;
  tax_registration_number?: string;
  relationship?: string[];
  company_identification?: CompanyIdentification[];
  attachments?: string[];
  created_ts: string;
  modified_ts: string;
}

// --- Journal Line Items ---

export interface JournalLineItem {
  id: string;
  journal: string;
  account: string;
  contact?: string;
  description: string;
  amount: number;
  amount_to_bcy: number;
  currency: string;
  tax_rate?: string;
  item?: string;
  branch?: string | null;
  project?: string | null;
  cost_center?: string;
  created_ts: string;
  modified_ts: string;
}

// --- Manual Journals ---

export interface ManualJournalLineItem {
  id: string;
  manual_journal: string;
  account: string;
  contact?: string;
  description: string;
  amount: number;
  amount_to_bcy: number;
  currency: string;
  exchange_rate: number;
  tax_rate?: string;
  tax_amount?: number;
  branch?: string | null;
  project?: string | null;
  cost_center?: string;
  place_of_supply?: string;
  created_ts: string;
  modified_ts: string;
}

export interface ManualJournal {
  id: string;
  serial_number: string;
  date: string;
  reference?: string;
  notes?: string;
  tax_amount_type: string;
  line_items: ManualJournalLineItem[];
  attachments?: string[];
  created_ts: string;
  modified_ts: string;
}

// --- Manual Journal Create Input ---

export interface CreateManualJournalLineItemInput {
  account: string;
  description: string;
  amount: number;
  amount_to_bcy: number;
  currency: string;
  contact?: string;
  tax_rate?: string;
  tax_amount?: number;
  branch?: string | null;
  project?: string | null;
  cost_center?: string;
  place_of_supply?: string;
}

export interface CreateManualJournalInput {
  date: string;
  line_items: CreateManualJournalLineItemInput[];
  reference?: string;
  notes?: string;
  tax_amount_type?: "TAX_EXCLUSIVE" | "TAX_INCLUSIVE";
  attachments?: string[];
}
