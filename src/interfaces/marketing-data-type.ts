import { IStatus } from "./status-type";

export interface MarketingData {
    id: number;
    week: string;
    closing_date: string;
    total_reach_of_the_brand: number;
    visits_to_profile: number;
    impressions: number;
    web_visits: number;
    interactions: number;
    executed_actions: number;
    in_progress_actions: number;
    status?: IStatus;
    status_id?: number;
    created_at: string;
    updated_at: string;
}