import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { WafeqClient } from "../wafeq-client.js";

export function registerBillTools(
  server: McpServer,
  client: WafeqClient,
): void {
  server.tool(
    "wafeq_list_bills",
    "List bills (purchase invoices) from Wafeq. Filter by date, due date, contact, branch, project, or reference.",
    {
      bill_date: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Must be YYYY-MM-DD format")
        .optional()
        .describe("Filter by bill date (YYYY-MM-DD)"),
      bill_due_date: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Must be YYYY-MM-DD format")
        .optional()
        .describe("Filter by bill due date (YYYY-MM-DD)"),
      contact: z
        .string()
        .optional()
        .describe("Filter by contact (vendor) ID"),
      branch: z.string().optional().describe("Filter by branch ID"),
      project: z.string().optional().describe("Filter by project ID"),
      reference: z.string().optional().describe("Filter by reference"),
      page: z.number().optional().describe("Page number"),
      page_size: z.number().optional().describe("Results per page"),
    },
    async (params) => {
      try {
        const result = await client.listBills({
          bill_date: params.bill_date,
          bill_due_date: params.bill_due_date,
          contact: params.contact,
          branch: params.branch,
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
