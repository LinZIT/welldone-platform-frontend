import { IKPIMarketingData } from ".";

export interface MarketingLinkedInData {
    id: number;
    k_p_i_marketing_id: number;
    k_p_i_marketing: IKPIMarketingData;
    posts: number; // Publicaciones [Entero]
    ads: number; // Ads [Entero]
    likes: number; // Me gusta [Entero]
    shares: number; // Compartidos [Entero]
    comments: number; // Comentarios [Entero]
    clicks: number; // Clicks [Entero]
    followers: number; // Seguidores [Entero]
    impressions: number; // Impresiones [Entero]
    profile_visits: number; // Visitas al perfil [Entero]
    search_appearances:number;// Aparaciones en busqueda [Entero]
    total_interactions: number; // Interacciones totales [Entero](Sumatoria de: Me gusta, Compartidos, Comentarios, Clics)
    created_at: string;
    updated_at: string;
}