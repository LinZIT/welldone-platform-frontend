import { IKPIMarketingData } from ".";

export interface MarketingExecutedActionsData {
    id: number;
    k_p_i_marketing_id: number; // Semana [Texto]
    k_p_i_marketing: IKPIMarketingData; // Fecha de cierre [Fecha]
    actions: number;  // Acciones [Entero]
    description: string;  // Descripcion [Texto]
    observation: string;   // Observacion [Texto]
    created_at: string;
    updated_at: string;
}