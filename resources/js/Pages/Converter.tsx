import { ConversionForm } from '@/Components/CurrencyConverter/ConversionForm';
import { ConversionResults } from '@/Components/CurrencyConverter/ConversionResults';
import { ExchangeRate, Pipeline } from '@/types/models';
import { Head } from '@inertiajs/react';
import { useCallback, useState } from 'react';

interface ConverterProps {
    exchangeRates: ExchangeRate[];
    lastUpdated: string | null;
    pipelines: Pipeline[];
}

export default function ConverterPage({ exchangeRates }: ConverterProps) {
    const [amount, setAmount] = useState('');
    const [selectedCurrency, setSelectedCurrency] = useState(
        exchangeRates[0].alphaCode,
    );
    const [convertedAmounts, setConvertedAmounts] = useState<
        Record<string, string>
    >({});
    const [showRatesTable, setShowRatesTable] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const calculateConversions = useCallback(() => {
        if (!amount || isNaN(Number(amount))) {
            setConvertedAmounts({});
            return;
        }

        const numericAmount = Number(amount);
        const selectedRate = exchangeRates.find(
            (rate) => rate.alphaCode === selectedCurrency,
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
                rate.alphaCode === 'USD' ? usdAmount : usdAmount * rate.rate;
            newConvertedAmounts[rate.alphaCode] = convertedAmount.toFixed(2);
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
                </div>
            </div>
        </>
    );
}
