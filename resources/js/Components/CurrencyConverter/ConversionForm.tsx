import { ExchangeRate } from '@/types/models';
import {
    Button,
    Field,
    Fieldset,
    Input,
    Label,
    Select,
} from '@headlessui/react';
import { motion } from 'framer-motion';

interface ConversionFormProps {
    amount: string;
    selectedCurrency: string;
    exchangeRates: ExchangeRate[];
    onAmountChange: (amount: string) => void;
    onCurrencyChange: (currency: string) => void;
    onConvert: () => void;
    isLoading: boolean;
    error: string | null;
}

export function ConversionForm({
    amount,
    selectedCurrency,
    exchangeRates,
    onAmountChange,
    onCurrencyChange,
    onConvert,
    isLoading,
    error,
}: ConversionFormProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 overflow-hidden rounded-lg bg-white p-6 shadow-lg"
        >
            <Fieldset className="grid gap-4 sm:grid-cols-2">
                <Field>
                    <Label className="block text-sm font-medium text-gray-700">
                        Amount
                    </Label>
                    <div className="mt-1">
                        <Input
                            type="number"
                            name="amount"
                            id="amount"
                            value={amount}
                            onChange={(e) => onAmountChange(e.target.value)}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            placeholder="Enter amount"
                            min="0"
                            step="0.01"
                        />
                    </div>
                </Field>

                <Field>
                    <Label
                        htmlFor="currency"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Currency
                    </Label>
                    <div className="mt-1">
                        <Select
                            id="currency"
                            name="currency"
                            value={selectedCurrency}
                            onChange={(e) => onCurrencyChange(e.target.value)}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        >
                            {exchangeRates.map((rate) => (
                                <option
                                    key={rate.alphaCode}
                                    value={rate.alphaCode}
                                >
                                    {rate.alphaCode} - {rate.name}
                                </option>
                            ))}
                        </Select>
                    </div>
                </Field>
            </Fieldset>

            {error && (
                <div className="mt-4 rounded-md bg-red-50 p-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg
                                className="h-5 w-5 text-red-400"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="mt-4">
                <Button
                    type="button"
                    onClick={onConvert}
                    disabled={isLoading || !amount}
                    className="inline-flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
                >
                    {isLoading ? (
                        <>
                            <svg
                                className="-ml-1 mr-3 h-5 w-5 animate-spin text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                            </svg>
                            Converting...
                        </>
                    ) : (
                        'Convert'
                    )}
                </Button>
            </div>
        </motion.div>
    );
}
