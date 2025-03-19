import { IKPIMarketingData } from ".";

export interface MarketingWebData {
    id: number;
    k_p_i_marketing_id: number;
    k_p_i_marketing: IKPIMarketingData;
    users: number; // Usuarios [Entero]
    new_users: number; // Usuarios nuevos [Entero]
    visits: number; // Visitas [Entero]
    events_quantity: number; // Numero de eventos [Entero]
    created_at: string;
    updated_at: string;
}