import {ExchangeRate} from '@/types/models';
import {
    Button,
    Field,
    Fieldset,
    Input,
    Label,
    Select,
} from '@headlessui/react';
import {ArrowPathIcon} from '@heroicons/react/24/outline';
import {motion} from 'framer-motion';
import {Deferred} from "@inertiajs/react";

interface ConversionFormProps {
    amount: string;
    selectedCurrency: string;
    exchangeRates: ExchangeRate[];
    onAmountChange: (amount: string) => void;
    onCurrencyChange: (currency: string) => void;
    onConvert: () => void;
    isLoading: boolean;
}

export function ConversionForm({
                                   amount,
                                   selectedCurrency,
                                   exchangeRates,
                                   onAmountChange,
                                   onCurrencyChange,
                                   onConvert,
                                   isLoading,
                               }: ConversionFormProps) {
    return (
        <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{delay: 0.3}}
            className="mb-8"
        >
            <div
                className="overflow-hidden rounded-lg bg-gradient-to-br from-purple-50/80 to-blue-50/80 p-6 shadow-lg backdrop-blur-sm">
                <Fieldset className="grid gap-4 sm:grid-cols-3">
                    <Field className="sm:col-span-2">
                        <Label className="block text-sm font-medium text-gray-700">
                            Amount
                        </Label>
                        <div className="relative mt-1 rounded-md shadow-sm">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <span className="text-gray-500 sm:text-sm">
                                    {selectedCurrency}
                                </span>
                            </div>
                            <Input
                                type="number"
                                name="amount"
                                id="amount"
                                value={amount}
                                onChange={(e) => onAmountChange(e.target.value)}
                                className="block w-full rounded-md border-gray-300 pl-12 focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                                placeholder="0.00"
                                min="0"
                                step="0.01"
                            />
                        </div>
                    </Field>
                    <Field>
                        <Label className="block text-sm font-medium text-gray-700">
                            Currency
                        </Label>
                        <Select
                            id="currency"
                            name="currency"
                            value={selectedCurrency}
                            onChange={(e) => onCurrencyChange(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-purple-500 focus:outline-none focus:ring-purple-500 sm:text-sm"
                        >
                            {exchangeRates.map((rate) => (
                                <option key={rate.id} value={rate.alphaCode}>
                                    {rate.alphaCode} - {rate.name}
                                </option>
                            ))}
                        </Select>
                    </Field>
                </Fieldset>
                <div className="mt-4 flex justify-end">
                    <Button
                        onClick={onConvert}
                        disabled={isLoading}
                        className="inline-flex items-center rounded-md border border-transparent bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                    >
                        {isLoading ? (
                            <>
                                <ArrowPathIcon className="-ml-1 mr-3 h-5 w-5 animate-spin text-white"/>
                                Converting...
                            </>
                        ) : (
                            'Convert'
                        )}
                    </Button>
                </div>
            </div>
        </motion.div>
    );
}
