import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { WafeqClient } from "../wafeq-client.js";

export function registerBankAccountTools(
  server: McpServer,
  client: WafeqClient,
): void {
  server.tool(
    "wafeq_list_bank_accounts",
    "List bank accounts from Wafeq. Filter by classification, sub-classification (BANK, PETTY_CASH, CREDIT_CARD), or currency.",
    {
      classification: z
        .enum(["ASSET", "LIABILITY", "EQUITY", "REVENUE", "EXPENSE"])
        .optional()
        .describe("Filter by account classification"),
      sub_classification: z
        .enum(["BANK", "PETTY_CASH", "CREDIT_CARD"])
        .optional()
        .describe("Filter by bank account type"),
      currency: z
        .string()
        .optional()
        .describe("Filter by currency code (e.g. SAR, AED, USD)"),
      page: z.number().optional().describe("Page number"),
      page_size: z.number().optional().describe("Results per page"),
    },
    async (params) => {
      try {
        const result = await client.listBankAccounts({
          classification: params.classification,
          sub_classification: params.sub_classification,
          currency: params.currency,
          page: params.page?.toString(),
          page_size: params.page_size?.toString(),
        });
        return {
          content: [
            { type: "text", text: JSON.stringify(result, null, 2) },
          ],
        };
      } catch (error) {
        return {
          isError: true,
          content: [
            {
              type: "text",
              text: `Error: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
        };
      }
    },
  );
}
