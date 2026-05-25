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
  TransactionLineItemInputSchema,
} from "./common.js";

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

  server.tool(
    "wafeq_create_bill",
    "Create a bill (purchase invoice) in Wafeq. Use this for supplier invoices that should appear in Purchases > Bills with AP aging and VAT reclaim.",
    {
      bill_number: z.string().describe("Supplier bill number"),
      bill_date: DateSchema.describe("Bill issue date (YYYY-MM-DD)"),
      bill_due_date: DateSchema.describe("Bill due date (YYYY-MM-DD)"),
      contact: z.string().describe("Supplier contact ID"),
      currency: CurrencySchema,
      line_items: z
        .array(TransactionLineItemInputSchema)
        .min(1)
        .describe("Bill line items"),
      tax_amount_type: TaxAmountTypeSchema,
      status: z
        .enum(["DRAFT", "AUTHORIZED", "PAID"])
        .optional()
        .describe("Bill status"),
      reference: z.string().optional().describe("Reference"),
      notes: z.string().optional().describe("Notes"),
      order_number: z.string().optional().describe("Order number"),
      attachments: AttachmentsSchema,
      branch: z.string().nullable().optional().describe("Branch ID"),
      project: z.string().nullable().optional().describe("Project ID"),
      exchange_rate: z
        .number()
        .nullable()
        .optional()
        .describe("Exchange rate to base currency"),
      external_id: z.string().optional().describe("External identifier"),
      custom_fields: z
        .record(z.unknown())
        .optional()
        .describe("Custom field ID to value mapping"),
      idempotency_key: IdempotencyKeySchema,
    },
    async (params) => {
      try {
        const result = await client.createBill(
          {
            bill_number: params.bill_number,
            bill_date: params.bill_date,
            bill_due_date: params.bill_due_date,
            contact: params.contact,
            currency: params.currency,
            line_items: params.line_items,
            tax_amount_type: params.tax_amount_type,
            status: params.status,
            reference: params.reference,
            notes: params.notes,
            order_number: params.order_number,
            attachments: params.attachments,
            branch: params.branch,
            project: params.project,
            exchange_rate: params.exchange_rate,
            external_id: params.external_id,
            custom_fields: params.custom_fields,
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
