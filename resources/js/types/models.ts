export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | undefined;
}

export interface SharedPageProps {
    auth: {
        user: User;
    };
    flash: {
        status: string;
        message: string | null;
    };
}

export interface ConverterPageProps extends SharedPageProps {
    conversions?: Record<
        string,
        {
            amount: number;
            rate: number;
            name: string;
        }
    >;
}

export interface ExchangeRate {
    id: number;
    alphaCode: string;
    name: string;
    rate: number;
    created_at: string;
    updated_at: string;
}

export interface Pipeline {
    id: number;
    name: string;
    cron_expression: string;
    is_active: boolean;
    is_scheduled: boolean;
    last_run_at: string | null;
    created_at: string;
    updated_at: string;
}

export interface IpAddress {
    id: number;
    ip_address: string;
    description: string;
    created_at: string;
    updated_at: string;
}

export interface ConversionResponse {
    conversions: Record<
        string,
        {
            amount: number;
            rate: number;
            name: string;
        }
    >;
    timestamp: string;
    base_currency: string;
    source_amount: number;
    source_currency: string;
}

export interface ConversionError {
    error: string;
    code: 'VALIDATION_ERROR' | 'SERVICE_ERROR' | 'UNEXPECTED_ERROR';
    debug?: string;
    errors?: Record<string, string[]>;
}
