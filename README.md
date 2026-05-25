# Wafeq MCP Server

An MCP (Model Context Protocol) server that connects AI assistants to the [Wafeq](https://wafeq.com) accounting software API. Provides access to accounts, contacts, invoices, bills, expenses, credit/debit notes, payments, manual journals, journal line items, tax rates, files, and financial reports — plus the ability to create and update accounting documents.

## Prerequisites

- Node.js 18+
- A Wafeq account on the Starter plan or above
- A Wafeq API key ([how to get one](https://developer.wafeq.com/reference/get-your-api-key))

## Setup

```bash
npm install
npm run build
```

## Usage with Cursor

Add to your Cursor MCP settings (`.cursor/mcp.json` in your home directory or project):

```json
{
  "mcpServers": {
    "wafeq": {
      "command": "node",
      "args": ["/absolute/path/to/wafeq-mcp/dist/index.js"],
      "env": {
        "WAFEQ_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

## Testing with MCP Inspector

```bash
WAFEQ_API_KEY=your-key npx @modelcontextprotocol/inspector node dist/index.js
```

This opens a browser-based UI where you can list tools, invoke them with custom inputs, and inspect responses.

## Available Tools

| Tool | Description |
|---|---|
| `wafeq_list_accounts` | List chart of accounts. Filter by classification, payment-enabled, or system accounts. |
| `wafeq_list_bank_accounts` | List bank accounts. Filter by type (BANK, PETTY_CASH, CREDIT_CARD) or currency. |
| `wafeq_list_bills` | List bills (purchase invoices). Filter by date, contact, branch, project, or reference. |
| `wafeq_create_bill` | Create a bill with supplier, dates, line items, tax amount type, and attachments. |
| `wafeq_list_contacts` | List contacts (customers, suppliers, partners). Filter by keyword, relationship type, or country. |
| `wafeq_create_contact` | Create a supplier, customer, investor, partner, or other contact. |
| `wafeq_list_credit_notes` | List credit notes (adjustments/refunds against invoices). Filter by status, contact, date, branch, or project. |
| `wafeq_create_credit_note` | Create a credit note for customer refunds or invoice adjustments. |
| `wafeq_list_debit_notes` | List debit notes (adjustments against bills). Filter by contact, date, branch, or project. |
| `wafeq_create_debit_note` | Create a debit note for bill or supplier adjustments. |
| `wafeq_list_expenses` | List expenses. Filter by account, contact, date, project, or paid-through account. |
| `wafeq_create_expense` | Create a cash expense with account, paid-through account, tax rate, and attachments. |
| `wafeq_upload_file` | Upload a source file to Wafeq and use the returned file ID in attachments. |
| `wafeq_list_invoices` | List invoices. Filter by status (DRAFT, SENT, FINALIZED), contact, date, or project. |
| `wafeq_create_invoice` | Create a customer sales invoice with line items, tax amount type, and attachments. |
| `wafeq_list_journal_line_items` | List journal line items for transaction-level detail across all journals. Uses cursor-based pagination. |
| `wafeq_list_manual_journals` | List manual journals (adjusting entries, reclassifications, corrections). Filter by date or reference. |
| `wafeq_create_manual_journal` | Create a manual journal entry (adjusting entries, reclassifications, corrections). Includes client-side balance validation and idempotency key support. |
| `wafeq_update_manual_journal` | Partially update a manual journal entry. Includes client-side balance validation when replacing line items. |
| `wafeq_list_payments` | List payments (cash movements for invoices, bills, credit/debit notes). Filter by contact, date, or project. |
| `wafeq_create_payment` | Create a payment and allocate it to bills, invoices, credit notes, or debit notes, including payment fees. |
| `wafeq_list_tax_rates` | List tax rates and filter by tax type (SALES, PURCHASES, REVERSE_CHARGE, OUT_OF_SCOPE). |
| `wafeq_get_balance_sheet` | Generate a balance sheet report at a specific date with optional period comparisons. |
| `wafeq_get_profit_loss` | Generate a profit & loss (income statement) report for a date range grouped by month or year. |
| `wafeq_get_trial_balance` | Generate trial balance report for a date range with debit/credit/balance totals. |

All list tools support `page` and `page_size` parameters for pagination. `wafeq_list_journal_line_items` uses cursor-based pagination instead (`cursor` and `page_size`).
