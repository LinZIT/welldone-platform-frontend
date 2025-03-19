import { IKPIMarketingData } from ".";

export interface MarketingInstagramData {
    id: number;
    k_p_i_marketing_id: number;
    k_p_i_marketing: IKPIMarketingData;
    posts: number; // Publicaciones [Entero]
    ads: number; // Ads [Entero]
    stories: number; // Stories [Entero]
    bookmarks: number; // Guardados [Entero]
    shares: number; // Compartidos [Entero]
    comments: number; // Comentarios [Entero]
    likes: number; // Me gusta [Entero]
    followers: number; // Seguidores [Entero]
    reach: number; // Alcance [Entero]
    impressions: number; // Impresiones [Entero]
    profile_visits: number; // Visitas al perfil [Entero]
    web_link: number; // Enlace web [Entero]
    total_interactions: number; // Interacciones totales [Entero] (Sumatoria de: Guardados, Compartidos, Comentarios, Me gusta)
    created_at: string;
    updated_at: string;
}