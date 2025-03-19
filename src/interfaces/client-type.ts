import { IClaim } from "./claim-type";
import { ClaimsData } from "./claims-data-type";

export interface IClient {
    id: number;
    names: string;
    surnames: string;
    address: string;
    city: string;
    state: string;
    zip_code: string;
    email: string;
    phone: string;
    claims: IClaim[];
    aditional_phone_1: string;
    aditional_phone_1_description: string;
    aditional_phone_2: string;
    aditional_phone_2_description: string;
}