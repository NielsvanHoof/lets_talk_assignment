import { Header } from '@/Components/CurrencyConverter/Header';
import { PipelineTable } from '@/Components/CurrencyConverter/PipelineTable';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { ExchangeRate, Pipeline } from '@/types/models';
import { Head, usePage } from '@inertiajs/react';
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
    const auth = usePage().props.auth;

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <Header lastUpdated={lastUpdated} />

                    <ConverterPage
                        exchangeRates={exchangeRates}
                        lastUpdated={lastUpdated}
                        pipelines={pipelines}
                    />

                    {auth.user && <PipelineTable pipelines={pipelines} />}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
