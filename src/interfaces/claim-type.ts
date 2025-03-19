import { IAdviser } from "./adviser-type";
import { ITeam } from "./team-type";

export interface IClaim {
    id: number; // ID
    claim_number: number; // Numero de Claim
    claim_date: string; // Fecha
    cause: string; // Causa
    advisers: IAdviser[];
    location_of_damage: string; // Ubicacion del daño
    team_id: number; // ID Equipo 
    team: ITeam; // Equipo
    adjusting_company: AdjustingCompany; // Empresa ajustadora
    insurance_company: InsuranceCompany; // Compañia de seguros
    policy_number: string; // Numero de poliza
    address: string; // Direccion
    city: string; // Ciudad
    state: string; // Estado
    zip_code: number; // Zip Code
}

interface AdjustingCompany {
    id: number;
    description: string;
    created_at: string;
    updated_at: string;
}
interface InsuranceCompany {
    id: number;
    description: string;
    created_at: string;
    updated_at: string;
}