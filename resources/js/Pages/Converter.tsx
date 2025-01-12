import { ConversionForm } from '@/Components/CurrencyConverter/ConversionForm';
import { ConversionResults } from '@/Components/CurrencyConverter/ConversionResults';
import { Header } from '@/Components/CurrencyConverter/Header';
import { PipelineTable } from '@/Components/CurrencyConverter/PipelineTable';
import {
    ConversionError,
    ConversionResponse,
    ExchangeRate,
    Pipeline,
} from '@/types/models';
import { Button } from '@headlessui/react';
import { PauseIcon, PlayIcon } from '@heroicons/react/24/outline';
import { Head, usePage, usePoll } from '@inertiajs/react';
import axios, { AxiosError } from 'axios';
import { motion } from 'framer-motion';
import { useState } from 'react';

interface ConverterProps {
    exchangeRates: ExchangeRate[];
    lastUpdated: string | null;
    pipelines: Pipeline[];
}

export default function ConverterPage({
    exchangeRates,
    lastUpdated,
    pipelines,
}: ConverterProps) {
    const { auth } = usePage().props;
    const [isPolling, setIsPolling] = useState(false);
    const [showRatesTable, setShowRatesTable] = useState(false);
    const [convertedAmounts, setConvertedAmounts] = useState<
        Record<string, string>
    >({});
    const [amount, setAmount] = useState('');
    const [selectedCurrency, setSelectedCurrency] = useState(
        exchangeRates[0].alphaCode,
    );
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { start, stop } = usePoll(
        2000,
        {},
        {
            autoStart: false,
        },
    );

    const togglePolling = () => {
        if (isPolling) {
            stop();
            setIsPolling(false);
        } else {
            start();
            setIsPolling(true);
        }
    };

    const handleConvert = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const { data } = await axios.post<ConversionResponse>(
                route('exchange-rates.convert'),
                {
                    amount,
                    from_currency: selectedCurrency,
                },
            );

            setConvertedAmounts(
                Object.fromEntries(
                    Object.entries(data.conversions).map(([currency, info]) => [
                        currency,
                        info.amount.toFixed(2),
                    ]),
                ),
            );
            setAmount('');
        } catch (err) {
            if (axios.isAxiosError(err)) {
                const axiosError = err as AxiosError<ConversionError>;
                if (axiosError.response?.data) {
                    const errorData = axiosError.response.data;
                    let errorMessage = errorData.error;

                    switch (errorData.code) {
                        case 'VALIDATION_ERROR':
                            if (errorData.errors) {
                                errorMessage = Object.values(errorData.errors)
                                    .flat()
                                    .join('\n');
                            }
                            errorMessage +=
                                ' Please check your input and try again.';
                            break;
                        case 'SERVICE_ERROR':
                            errorMessage +=
                                ' The service will be restored shortly.';
                            break;
                        case 'UNEXPECTED_ERROR':
                            errorMessage += ' Please try again later.';
                            break;
                    }

                    setError(errorMessage);
                } else {
                    setError(
                        'Failed to connect to the conversion service. Please check your internet connection.',
                    );
                }
            } else {
                setError('An unexpected error occurred. Please try again.');
            }
            setConvertedAmounts({});
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Head title="Currency Converter" />

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12"
            >
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ y: -50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{
                            delay: 0.2,
                            type: 'spring',
                            stiffness: 100,
                        }}
                        className="mb-8"
                    >
                        <Header lastUpdated={lastUpdated} />

                        <div className="mb-4 flex items-center space-x-4">
                            <Button
                                onClick={togglePolling}
                                className={`inline-flex items-center rounded-md px-3 py-2 text-sm font-medium ${
                                    isPolling
                                        ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                                }`}
                            >
                                {isPolling ? (
                                    <>
                                        <PauseIcon className="mr-2 h-4 w-4" />
                                        Stop Live Updates
                                    </>
                                ) : (
                                    <>
                                        <PlayIcon className="mr-2 h-4 w-4" />
                                        Start Live Updates
                                    </>
                                )}
                            </Button>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{
                            delay: 0.4,
                            type: 'spring',
                            stiffness: 100,
                        }}
                    >
                        <ConversionForm
                            amount={amount}
                            selectedCurrency={selectedCurrency}
                            exchangeRates={exchangeRates}
                            onAmountChange={setAmount}
                            onCurrencyChange={setSelectedCurrency}
                            onConvert={handleConvert}
                            isLoading={isLoading}
                            error={error}
                        />

                        <ConversionResults
                            exchangeRates={exchangeRates}
                            convertedAmounts={convertedAmounts}
                            showRatesTable={showRatesTable}
                            onToggleRates={() =>
                                setShowRatesTable(!showRatesTable)
                            }
                            isLoading={isLoading}
                        />
                    </motion.div>

                    {auth.user && (
                        <motion.div
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{
                                delay: 0.6,
                                type: 'spring',
                                stiffness: 100,
                            }}
                        >
                            <PipelineTable pipelines={pipelines} />
                        </motion.div>
                    )}
                </div>
            </motion.div>
        </>
    );
}
