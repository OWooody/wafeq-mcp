#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { WafeqClient } from "./wafeq-client.js";
import { registerAccountTools } from "./tools/accounts.js";
import { registerBalanceSheetTools } from "./tools/balance-sheet.js";
import { registerBankAccountTools } from "./tools/bank-accounts.js";
import { registerBillTools } from "./tools/bills.js";
import { registerContactTools } from "./tools/contacts.js";
import { registerCreditNoteTools } from "./tools/credit-notes.js";
import { registerDebitNoteTools } from "./tools/debit-notes.js";
import { registerExpenseTools } from "./tools/expenses.js";
import { registerFileTools } from "./tools/files.js";
import { registerInvoiceTools } from "./tools/invoices.js";
import { registerJournalLineItemTools } from "./tools/journal-line-items.js";
import { registerManualJournalTools } from "./tools/manual-journals.js";
import { registerPaymentTools } from "./tools/payments.js";
import { registerProfitLossTools } from "./tools/profit-loss.js";
import { registerTaxRateTools } from "./tools/tax-rates.js";
import { registerTrialBalanceTools } from "./tools/trial-balance.js";

const apiKey = process.env.WAFEQ_API_KEY;
if (!apiKey) {
  console.error("WAFEQ_API_KEY environment variable is required");
  process.exit(1);
}

const client = new WafeqClient(apiKey);

const server = new McpServer({
  name: "wafeq",
  version: "1.0.0",
});

registerAccountTools(server, client);
registerBalanceSheetTools(server, client);
registerBankAccountTools(server, client);
registerBillTools(server, client);
registerContactTools(server, client);
registerCreditNoteTools(server, client);
registerDebitNoteTools(server, client);
registerExpenseTools(server, client);
registerFileTools(server, client);
registerInvoiceTools(server, client);
registerJournalLineItemTools(server, client);
registerManualJournalTools(server, client);
registerPaymentTools(server, client);
registerProfitLossTools(server, client);
registerTaxRateTools(server, client);
registerTrialBalanceTools(server, client);

const transport = new StdioServerTransport();
await server.connect(transport);
