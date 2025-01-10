export interface ExchangeRate {
    id: number;
    code: string;
    alphaCode: string;
    name: string;
    rate: number;
    date: string;
    inverseRate: number;
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
