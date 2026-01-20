export interface Product {
    id: string;
    sku: string;
    name: string;
    description?: string;
    base_cost: number;
    current_price: number;
    min_margin_percent: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface PriceHistory {
    old_price: number;
    new_price: number;
    trigger_source: string;
    created_at: string;
    notes?: string;
}
