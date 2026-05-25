import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { WafeqClient } from "../wafeq-client.js";
import { toErrorResponse, toTextResponse } from "./common.js";

export function registerFileTools(server: McpServer, client: WafeqClient): void {
  server.tool(
    "wafeq_upload_file",
    "Upload a source file to Wafeq and return its file ID. Pass the returned ID in attachments when creating bills, expenses, invoices, contacts, journals, credit notes, or debit notes.",
    {
      file_path: z
        .string()
        .describe("Local path to the file to upload, such as a PDF invoice"),
      mime_type: z
        .string()
        .optional()
        .describe("MIME type override, e.g. application/pdf"),
    },
    async (params) => {
      try {
        const result = await client.uploadFile(params.file_path, params.mime_type);
        return toTextResponse(result);
      } catch (error) {
        return toErrorResponse(error);
      }
    },
  );
}
