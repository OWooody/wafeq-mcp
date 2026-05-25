import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { WafeqClient } from "../wafeq-client.js";
import { toErrorResponse, toTextResponse } from "./common.js";

export function registerTaxRateTools(
  server: McpServer,
  client: WafeqClient,
): void {
  server.tool(
    "wafeq_list_tax_rates",
    "List tax rates from Wafeq. Use this to look up tax rate IDs for VAT on purchases, VAT on sales, zero-rated, reverse charge, and out-of-scope tax rates.",
    {
      tax_type: z
        .enum(["SALES", "PURCHASES", "REVERSE_CHARGE", "OUT_OF_SCOPE"])
        .optional()
        .describe("Filter by tax type"),
      external_id: z.string().optional().describe("Filter by external ID"),
      created_ts_after: z
        .string()
        .optional()
        .describe("Created after timestamp"),
      created_ts_before: z
        .string()
        .optional()
        .describe("Created before timestamp"),
      modified_ts_after: z
        .string()
        .optional()
        .describe("Modified after timestamp"),
      modified_ts_before: z
        .string()
        .optional()
        .describe("Modified before timestamp"),
      page: z.number().optional().describe("Page number"),
      page_size: z.number().optional().describe("Results per page"),
    },
    async (params) => {
      try {
        const result = await client.listTaxRates({
          tax_type: params.tax_type,
          external_id: params.external_id,
          created_ts_after: params.created_ts_after,
          created_ts_before: params.created_ts_before,
          modified_ts_after: params.modified_ts_after,
          modified_ts_before: params.modified_ts_before,
          page: params.page?.toString(),
          page_size: params.page_size?.toString(),
        });
        return toTextResponse(result);
      } catch (error) {
        return toErrorResponse(error);
      }
    },
  );
}
