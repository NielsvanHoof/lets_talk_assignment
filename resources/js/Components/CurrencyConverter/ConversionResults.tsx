import {ExchangeRate} from '@/types/models';
import {Button} from '@headlessui/react';
import {
    ArrowPathIcon,
    ChevronDownIcon,
    ChevronUpIcon,
} from '@heroicons/react/24/outline';
import {AnimatePresence, motion} from 'framer-motion';
import {WhenVisible} from "@inertiajs/react";

interface ConversionResultsProps {
    exchangeRates: ExchangeRate[];
    convertedAmounts: Record<string, string>;
    showRatesTable: boolean;
    onToggleRates: () => void;
    isLoading: boolean;
}

export function ConversionResults({
                                      exchangeRates,
                                      convertedAmounts,
                                      showRatesTable,
                                      onToggleRates,
                                      isLoading,
                                  }: ConversionResultsProps) {
    return (
        <motion.div
            initial={{opacity: 0, height: 0}}
            animate={{opacity: 1, height: 'auto'}}
            exit={{opacity: 0, height: 0}}
            transition={{duration: 0.3}}
            className="mb-8"
        >
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">
                    Conversion Results
                </h2>
                <Button
                    onClick={onToggleRates}
                    className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                >
                    {showRatesTable ? (
                        <>
                            Hide Rates
                            <ChevronUpIcon className="-mr-1 ml-2 h-4 w-4"/>
                        </>
                    ) : (
                        <>
                            Show Rates
                            <ChevronDownIcon className="-mr-1 ml-2 h-4 w-4"/>
                        </>
                    )}
                </Button>
            </div>

            <AnimatePresence>
                {showRatesTable && (
                    <motion.div
                        initial={{opacity: 0, height: 0}}
                        animate={{opacity: 1, height: 'auto'}}
                        exit={{opacity: 0, height: 0}}
                        transition={{
                            type: 'spring',
                            damping: 25,
                            stiffness: 200,
                        }}
                        className="relative mt-4 overflow-hidden rounded-lg border border-gray-200 bg-white shadow"
                    >
                        {isLoading && (
                            <div
                                className="absolute inset-0 z-10 flex items-center justify-center bg-white/80 backdrop-blur-sm">
                                <div className="flex flex-col items-center">
                                    <ArrowPathIcon className="h-8 w-8 animate-spin text-purple-600"/>
                                    <span className="mt-2 text-sm text-gray-500">
                                        Converting...
                                    </span>
                                </div>
                            </div>
                        )}
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Currency
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Converted Amount
                                </th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">

                            {exchangeRates.map((rate, index) => (
                                <WhenVisible
                                    buffer={100}
                                    key={rate.id}
                                    as="tr"
                                    fallback={
                                        <td className="p-4 text-sm text-gray-500">
                                            Loading exchange rates...
                                        </td>
                                    } data={'exchangeRates'}>
                                    <motion.tr
                                        initial={{opacity: 0, y: 10}}
                                        animate={{opacity: 1, y: 0}}
                                        transition={{delay: index * 0.05}}
                                        className="transition-colors hover:bg-gray-50"
                                    >
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <div className="flex items-center">
                                                <span
                                                    className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-purple-100 text-sm font-semibold text-gray-700">
                                                    {rate.alphaCode}
                                                </span>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {rate.name}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {rate.alphaCode}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900">
                                                {rate.alphaCode}{' '}
                                                {
                                                    convertedAmounts[
                                                        rate.alphaCode
                                                        ]
                                                }
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                Rate: {rate.rate.toFixed(4)}
                                            </div>
                                        </td>
                                    </motion.tr>
                                </WhenVisible>
                            ))}
                            </tbody>
                        </table>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
