import type {
  PaginatedResponse,
  Account,
  BankAccount,
  Bill,
  Expense,
  Invoice,
  TrialBalanceReport,
} from "./types/wafeq.js";

const BASE_URL = "https://api.wafeq.com/v1";
const REQUEST_TIMEOUT_MS = 30_000;

export class WafeqClient {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async request<T>(
    path: string,
    params?: Record<string, string | undefined>,
  ): Promise<T> {
    const url = new URL(`${BASE_URL}${path}`);

    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== "") {
          url.searchParams.set(key, value);
        }
      }
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          Authorization: `Api-Key ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        signal: controller.signal,
      });

      if (response.status === 429) {
        throw new Error(
          "Rate limited by Wafeq API, please retry shortly",
        );
      }

      if (!response.ok) {
        const body = await response.text();
        throw new Error(
          `Wafeq API error (HTTP ${response.status}): ${body}`,
        );
      }

      return (await response.json()) as T;
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        throw new Error(
          `Wafeq API request timed out after ${REQUEST_TIMEOUT_MS / 1000}s`,
        );
      }
      throw error;
    } finally {
      clearTimeout(timeout);
    }
  }

  async listAccounts(
    params?: Record<string, string | undefined>,
  ): Promise<PaginatedResponse<Account>> {
    return this.request<PaginatedResponse<Account>>("/accounts/", params);
  }

  async listBankAccounts(
    params?: Record<string, string | undefined>,
  ): Promise<PaginatedResponse<BankAccount>> {
    return this.request<PaginatedResponse<BankAccount>>(
      "/bank-accounts/",
      params,
    );
  }

  async listBills(
    params?: Record<string, string | undefined>,
  ): Promise<PaginatedResponse<Bill>> {
    return this.request<PaginatedResponse<Bill>>("/bills/", params);
  }

  async listExpenses(
    params?: Record<string, string | undefined>,
  ): Promise<PaginatedResponse<Expense>> {
    return this.request<PaginatedResponse<Expense>>("/expenses/", params);
  }

  async listInvoices(
    params?: Record<string, string | undefined>,
  ): Promise<PaginatedResponse<Invoice>> {
    return this.request<PaginatedResponse<Invoice>>("/invoices/", params);
  }

  async getTrialBalance(
    params?: Record<string, string | undefined>,
  ): Promise<TrialBalanceReport> {
    return this.request<TrialBalanceReport>(
      "/reports/trial-balance/",
      params,
    );
  }
}
