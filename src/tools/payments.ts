import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { WafeqClient } from "../wafeq-client.js";

export function registerPaymentTools(
  server: McpServer,
  client: WafeqClient,
): void {
  server.tool(
    "wafeq_list_payments",
    "List payments from Wafeq. Shows cash movements including invoice payments, bill payments, credit/debit note payments. Filter by contact, date, project, or reference.",
    {
      contact: z.string().optional().describe("Filter by contact ID"),
      date: z
        .string()
        .optional()
        .describe("Filter by payment date (YYYY-MM-DD)"),
      paid_through_account: z
        .string()
        .optional()
        .describe("Filter by paid-through account ID"),
      payment_fees_account: z
        .string()
        .optional()
        .describe("Filter by payment fees account ID"),
      project: z.string().optional().describe("Filter by project ID"),
      reference: z.string().optional().describe("Filter by reference"),
      page: z.number().optional().describe("Page number"),
      page_size: z.number().optional().describe("Results per page"),
    },
    async (params) => {
      try {
        const result = await client.listPayments({
          contact: params.contact,
          date: params.date,
          paid_through_account: params.paid_through_account,
          payment_fees_account: params.payment_fees_account,
          project: params.project,
          reference: params.reference,
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
