# Wafeq MCP Server

An MCP (Model Context Protocol) server that connects AI assistants to the [Wafeq](https://wafeq.com) accounting software API. Provides read-only access to accounts, bank accounts, bills, expenses, invoices, and trial balance reports.

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
| `wafeq_list_expenses` | List expenses. Filter by account, contact, date, project, or paid-through account. |
| `wafeq_list_invoices` | List invoices. Filter by status (DRAFT, SENT, FINALIZED), contact, date, or project. |
| `wafeq_get_trial_balance` | Generate trial balance report for a date range with debit/credit/balance totals. |

All list tools support `page` and `page_size` parameters for pagination.
