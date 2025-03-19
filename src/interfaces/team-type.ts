import { IAdviser, ICity } from ".";

export interface ITeam {
    id: number;
    adviser_id: number;
    adviser: IAdviser;
    city_id: number;
    city: ICity;
    created_at: string;
    updated_at: string;
}