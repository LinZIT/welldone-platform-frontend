import { IAdviser, ITeam } from ".";

export interface SalesData {
    id: number;
    closing_date: string;
    adviser: IAdviser;
    adviser_id: number;
    team_id: number;
    team: ITeam;
    date: string;
    week: string;
    roof: number;
    water: number;
    claims: number;
    observations: string;
}