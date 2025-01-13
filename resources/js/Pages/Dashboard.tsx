import { EmptyState } from '@/Components/CurrencyConverter/EmptyState';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { ExchangeRate, Pipeline } from '@/types/models';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import ConverterPage from './Converter';

interface DashboardProps {
    exchangeRates: ExchangeRate[];
    lastUpdated: string | null;
    pipelines: Pipeline[];
}

export default function Dashboard({
    exchangeRates,
    lastUpdated,
    pipelines,
}: DashboardProps) {
    const [isUpdating, setIsUpdating] = useState(false);

    const handleUpdateRates = () => {
        setIsUpdating(true);
        router.post(
            route('exchange-rates.update'),
            {},
            {
                preserveScroll: true,
                onFinish: () => setIsUpdating(false),
            },
        );
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Currency Converter
                </h2>
            }
        >
            <Head title="Currency Converter" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {exchangeRates.length === 0 ? (
                        <EmptyState
                            onUpdate={handleUpdateRates}
                            isUpdating={isUpdating}
                        />
                    ) : (
                        <ConverterPage
                            exchangeRates={exchangeRates}
                            lastUpdated={lastUpdated}
                            pipelines={pipelines}
                        />
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
