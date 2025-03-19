export interface IncomeData {
    id: number;
    closing_date: string;
    number_of_invoices_by_negotiation: number;
    value_of_invoices_by_negotiation: number;
    accounts_receivable_by_negotiation: number;
    income_by_negotiation: number;
    charges: number;
    number_of_calls: number;
    number_of_effective_calls: number;
    income_by_portfolio: number;
    accounts_receivable_by_portfolio: number;
    global_income: number;
    observations: string;
}