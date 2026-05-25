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

  server.tool(
    "wafeq_create_invoice",
    "Create a customer sales invoice in Wafeq. Use this for Sales > Invoices, including subscription invoices and ZATCA e-invoice flows.",
    {
      invoice_number: z.string().describe("Invoice number"),
      invoice_date: DateSchema.describe("Invoice issue date (YYYY-MM-DD)"),
      invoice_due_date: DateSchema.describe("Invoice due date (YYYY-MM-DD)"),
      contact: z.string().describe("Customer contact ID"),
      currency: CurrencySchema,
      line_items: z
        .array(TransactionLineItemInputSchema)
        .min(1)
        .describe("Invoice line items"),
      tax_amount_type: TaxAmountTypeSchema,
      status: z
        .enum(["DRAFT", "SENT", "FINALIZED"])
        .optional()
        .describe("Invoice status"),
      language: z.enum(["ar", "en"]).optional().describe("Invoice language"),
      reference: z.string().optional().describe("Reference"),
      notes: z.string().optional().describe("Notes"),
      purchase_order: z.string().optional().describe("Purchase order"),
      attachments: AttachmentsSchema,
      branch: z.string().nullable().optional().describe("Branch ID"),
      project: z.string().nullable().optional().describe("Project ID"),
      warehouse: z.string().nullable().optional().describe("Warehouse ID"),
      place_of_supply: z.string().optional().describe("Place of supply"),
      discount_amount: z.number().min(0).optional().describe("Discount amount"),
      discount_account: z.string().optional().describe("Discount account ID"),
      discount_tax_rate: z.string().optional().describe("Discount tax rate ID"),
      discount_cost_center: z
        .string()
        .optional()
        .describe("Discount cost center ID"),
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
        const result = await client.createInvoice(
          {
            invoice_number: params.invoice_number,
            invoice_date: params.invoice_date,
            invoice_due_date: params.invoice_due_date,
            contact: params.contact,
            currency: params.currency,
            line_items: params.line_items,
            tax_amount_type: params.tax_amount_type,
            status: params.status,
            language: params.language,
            reference: params.reference,
            notes: params.notes,
            purchase_order: params.purchase_order,
            attachments: params.attachments,
            branch: params.branch,
            project: params.project,
            warehouse: params.warehouse,
            place_of_supply: params.place_of_supply,
            discount_amount: params.discount_amount,
            discount_account: params.discount_account,
            discount_tax_rate: params.discount_tax_rate,
            discount_cost_center: params.discount_cost_center,
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
