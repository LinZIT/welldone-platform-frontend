export type AnalysisData = {
    id: number;
    closing_date: string;
    received_claims: number;
    checked_claims: number;
    approved_claims: number;
    rechecked_claims: number;
    cancelled_claims: number;
    on_hold_claims: number;
    unchecked_claims: number;
    approved_claims_weeks_before: number;
    clean_initiative: number;
    integrity_claims: number;
    received_leads: number;
    checked_leads: number;
    unchecked_leads: number;
    approved_leads: number;
    rechecked_leads: number;
    on_hold_leads: number;
    cancelled_leads: number;
    wdm_zone: string;
    observations: string;
    created_at: string;
    updated_at: string;
}