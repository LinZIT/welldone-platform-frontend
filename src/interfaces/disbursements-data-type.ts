export interface DisbursementsData {
    id: number;
    closing_date: string;
    number_of_overdue_invoices: number;
    value_of_paid_invoices: number;
    payable_accounts: number;
    paid_providers: number;
    observations: string;
    created_at: string;
    updated_at: string;
}