import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { WafeqClient } from "../wafeq-client.js";
import {
  AttachmentsSchema,
  CurrencySchema,
  DateSchema,
  IdempotencyKeySchema,
  TaxAmountTypeSchema,
  toErrorResponse,
  toTextResponse,
} from "./common.js";

export function registerExpenseTools(
  server: McpServer,
  client: WafeqClient,
): void {
  server.tool(
    "wafeq_list_expenses",
    "List expenses from Wafeq. Filter by account, contact, date, branch, project, paid-through account, or reference.",
    {
      account: z.string().optional().describe("Filter by account ID"),
      contact: z.string().optional().describe("Filter by contact ID"),
      branch: z.string().optional().describe("Filter by branch ID"),
      date: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Must be YYYY-MM-DD format")
        .optional()
        .describe("Filter by expense date (YYYY-MM-DD)"),
      paid_through_account: z
        .string()
        .optional()
        .describe("Filter by paid-through account ID"),
      project: z.string().optional().describe("Filter by project ID"),
      reference: z.string().optional().describe("Filter by reference"),
      page: z.number().optional().describe("Page number"),
      page_size: z.number().optional().describe("Results per page"),
    },
    async (params) => {
      try {
        const result = await client.listExpenses({
          account: params.account,
          contact: params.contact,
          branch: params.branch,
          date: params.date,
          paid_through_account: params.paid_through_account,
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

  server.tool(
    "wafeq_create_expense",
    "Create a cash expense in Wafeq. Use this for already-paid purchases, bank fees, portal-paid government fees, and direct bank payments without a formal supplier bill.",
    {
      account: z.string().describe("Expense account ID"),
      amount: z.number().positive().describe("Expense amount"),
      currency: CurrencySchema,
      date: DateSchema.describe("Expense date (YYYY-MM-DD)"),
      description: z.string().describe("Expense description"),
      paid_through_account: z
        .string()
        .describe("Payment-enabled account ID used to pay the expense"),
      tax_rate: z.string().optional().describe("Tax rate ID"),
      tax_amount_type: TaxAmountTypeSchema,
      contact: z.string().optional().describe("Supplier/contact ID"),
      reference: z.string().optional().describe("Reference"),
      attachments: AttachmentsSchema,
      branch: z.string().nullable().optional().describe("Branch ID"),
      project: z.string().nullable().optional().describe("Project ID"),
      cost_center: z.string().nullable().optional().describe("Cost center ID"),
      exchange_rate: z
        .number()
        .nullable()
        .optional()
        .describe("Exchange rate to base currency"),
      external_id: z.string().optional().describe("External identifier"),
      idempotency_key: IdempotencyKeySchema,
    },
    async (params) => {
      try {
        const result = await client.createExpense(
          {
            account: params.account,
            amount: params.amount,
            currency: params.currency,
            date: params.date,
            description: params.description,
            paid_through_account: params.paid_through_account,
            tax_rate: params.tax_rate,
            tax_amount_type: params.tax_amount_type,
            contact: params.contact,
            reference: params.reference,
            attachments: params.attachments,
            branch: params.branch,
            project: params.project,
            cost_center: params.cost_center,
            exchange_rate: params.exchange_rate,
            external_id: params.external_id,
          },
          params.idempotency_key,
        );
        return toTextResponse(result);
      } catch (error) {
        return toErrorResponse(error);
      }
    },
  );
}
