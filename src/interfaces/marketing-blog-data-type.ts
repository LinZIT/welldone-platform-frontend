import { IKPIMarketingData } from ".";

export interface MarketingBlogData {
    id: number;
    k_p_i_marketing_id: number;
    k_p_i_marketing: IKPIMarketingData;
    posts: number; // Posts [Entero]
    users: number; // Usuarios [Entero]
    comments: number; // Comentarios [Entero]
    visits: number; // Visitas [Entero]
    created_at: string;
    updated_at: string;
}