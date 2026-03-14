import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { WafeqClient } from "../wafeq-client.js";

export function registerInvoiceTools(
  server: McpServer,
  client: WafeqClient,
): void {
  server.tool(
    "wafeq_list_invoices",
    "List invoices from Wafeq. Filter by status (DRAFT, SENT, FINALIZED), contact, invoice date, branch, or project.",
    {
      status: z
        .enum(["DRAFT", "SENT", "FINALIZED"])
        .optional()
        .describe("Filter by invoice status"),
      contact: z
        .string()
        .optional()
        .describe("Filter by contact (customer) ID"),
      invoice_date: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Must be YYYY-MM-DD format")
        .optional()
        .describe("Filter by invoice date (YYYY-MM-DD)"),
      branch: z.string().optional().describe("Filter by branch ID"),
      project: z.string().optional().describe("Filter by project ID"),
      page: z.number().optional().describe("Page number"),
      page_size: z.number().optional().describe("Results per page"),
    },
    async (params) => {
      try {
        const result = await client.listInvoices({
          status: params.status,
          contact: params.contact,
          invoice_date: params.invoice_date,
          branch: params.branch,
          project: params.project,
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
