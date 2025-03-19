import { IKPIMarketingData } from ".";

export interface MarketingGMBData {
    id: number;
    k_p_i_marketing_id: number;
    k_p_i_marketing: IKPIMarketingData;
    posts: number; // Publicaciones [Entero]
    ads: number; // Ads [Entero]
    calls_made: number; // Llamadas realizadas [Entero]
    google_maps: number; // Google Maps [Entero]
    website_clicks: number; // Clicks en el sitio web [Entero]
    total_interactions: number; // Interacciones totales [Entero](Sumatoria de: Llamadas realizadas, Google Maps, Clics)
    created_at: string;
    updated_at: string;
}