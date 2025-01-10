import { ConversionForm } from '@/Components/CurrencyConverter/ConversionForm';
import { ConversionResults } from '@/Components/CurrencyConverter/ConversionResults';
import { Header } from '@/Components/CurrencyConverter/Header';
import { PipelineTable } from '@/Components/CurrencyConverter/PipelineTable';
import { ExchangeRate, Pipeline } from '@/types/models';
import { Head, usePage } from '@inertiajs/react';
import { useCallback, useState } from 'react';

interface WelcomeProps {
    exchangeRates: ExchangeRate[];
    lastUpdated: string | null;
    pipelines: Pipeline[];
}

export default function Welcome({
    exchangeRates,
    lastUpdated,
    pipelines,
}: WelcomeProps) {
    const auth = usePage().props.auth;

    const [amount, setAmount] = useState('');
    const [selectedCurrency, setSelectedCurrency] = useState('USD');
    const [convertedAmounts, setConvertedAmounts] = useState<
        Record<string, string>
    >({});
    const [showRatesTable, setShowRatesTable] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const calculateConversions = useCallback(() => {
        if (!amount || isNaN(Number(amount))) {
            setConvertedAmounts({});
            return;
        }

        const numericAmount = Number(amount);
        const selectedRate = exchangeRates.find(
            (rate) => rate.code === selectedCurrency,
        );

        if (!selectedRate) {
            return;
        }

        const usdAmount =
            selectedCurrency === 'USD'
                ? numericAmount
                : numericAmount / selectedRate.rate;

        const newConvertedAmounts: Record<string, string> = {};
        exchangeRates.forEach((rate) => {
            const convertedAmount =
                rate.code === 'USD' ? usdAmount : usdAmount * rate.rate;
            newConvertedAmounts[rate.code] = convertedAmount.toFixed(2);
        });

        setConvertedAmounts(newConvertedAmounts);
    }, [amount, selectedCurrency, exchangeRates]);

    const handleConvert = () => {
        setIsLoading(true);
        setTimeout(() => {
            calculateConversions();
            setIsLoading(false);
        }, 500);
    };

    return (
        <>
            <Head title="Currency Converter" />

            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <Header lastUpdated={lastUpdated} />

                    <ConversionForm
                        amount={amount}
                        selectedCurrency={selectedCurrency}
                        exchangeRates={exchangeRates}
                        onAmountChange={setAmount}
                        onCurrencyChange={setSelectedCurrency}
                        onConvert={handleConvert}
                        isLoading={isLoading}
                    />

                    <ConversionResults
                        exchangeRates={exchangeRates}
                        convertedAmounts={convertedAmounts}
                        showRatesTable={showRatesTable}
                        onToggleRates={() => setShowRatesTable(!showRatesTable)}
                        isLoading={isLoading}
                    />

                    {auth.user && <PipelineTable pipelines={pipelines} />}
                </div>
            </div>
        </>
    );
}
