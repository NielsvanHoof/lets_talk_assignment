export interface ExchangeRate {
    id: number;
    code: string;
    name: string;
    rate: number;
}

export interface Pipeline {
    id: number;
    name: string;
    cron: string;
    is_active: boolean;
    is_scheduled: boolean;
    last_run_at: string | null;
    created_at: string;
    updated_at: string;
}
