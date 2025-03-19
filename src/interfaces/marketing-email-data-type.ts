import { IKPIMarketingData } from ".";

export interface MarketingEmailData {
    id: number;
    k_p_i_marketing_id: number; // Semana [Texto]
    k_p_i_marketing: IKPIMarketingData; // Fecha de cierre [Fecha]
    email: string;  // Email [Entero]
    sent: number;  // Enviados [Entero]
    openings: number;   // Aperturas [Entero]
    clicks: number; // Clics [Entero]
    rebounds: number; // Rebotes [Entero]
    unsubs: number; // Desuscritos [Entero]
    created_at: string;
    updated_at: string;
}