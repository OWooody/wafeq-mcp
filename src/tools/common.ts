import { z } from "zod";

export const DateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Must be YYYY-MM-DD format");

export const CurrencySchema = z
  .string()
  .default("SAR")
  .describe("Currency code (defaults to SAR)");

export const TaxAmountTypeSchema = z
  .enum(["TAX_EXCLUSIVE", "TAX_INCLUSIVE"])
  .optional()
  .describe("Whether line amounts are exclusive or inclusive of tax");

export const AttachmentsSchema = z
  .array(z.string())
  .optional()
  .describe("File attachment IDs returned by wafeq_upload_file");

export const IdempotencyKeySchema = z
  .string()
  .optional()
  .describe("Unique key to prevent duplicate submissions on retry");

export const TransactionLineItemInputSchema = z.object({
  account: z.string().describe("Account ID for this line item"),
  description: z.string().describe("Description of the line item"),
  quantity: z.number().positive().default(1).describe("Quantity"),
  unit_amount: z
    .number()
    .describe("Unit amount before tax; use the full line amount when quantity is 1"),
  tax_rate: z.string().optional().describe("Tax rate ID"),
  cost_center: z.string().optional().describe("Cost center ID"),
  item: z.string().optional().describe("Item ID"),
  item_unit_of_measure: z
    .string()
    .nullable()
    .optional()
    .describe("Item unit of measure ID"),
  discount: z
    .number()
    .min(0)
    .nullable()
    .optional()
    .describe("Discount percentage"),
  order: z.number().int().optional().describe("Line item order"),
  custom_fields: z
    .record(z.unknown())
    .optional()
    .describe("Custom field ID to value mapping"),
});

export function toErrorResponse(error: unknown) {
  return {
    isError: true,
    content: [
      {
        type: "text" as const,
        text: `Error: ${error instanceof Error ? error.message : String(error)}`,
      },
    ],
  };
}

export function toTextResponse(data: unknown) {
  return {
    content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }],
  };
}
