import { ExchangeRate, Pipeline } from '@/types/models';
import { Dialog, Transition } from '@headlessui/react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { Head, router } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { Fragment, useCallback, useState } from 'react';

interface WelcomeProps {
    exchangeRates: ExchangeRate[];
    lastUpdated: string;
    pipelines: Pipeline[];
}

export default function Welcome({
    exchangeRates,
    lastUpdated,
    pipelines,
}: WelcomeProps) {
    const [amount, setAmount] = useState<string>('1');
    const [selectedCurrency, setSelectedCurrency] = useState<string>('USD');
    const [convertedAmounts, setConvertedAmounts] = useState<
        Record<string, string>
    >({});
    const [showResults, setShowResults] = useState(false);
    const [showRatesTable, setShowRatesTable] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [isUpdatingRates, setIsUpdatingRates] = useState(false);
    const [showPipelineModal, setShowPipelineModal] = useState(false);
    const [pipelineForm, setPipelineForm] = useState({
        name: '',
        cron: '0 0 * * *',
        is_active: true,
    });
    const [pipelineError, setPipelineError] = useState<string | null>(null);

    const calculateConversions = useCallback(() => {
        const amountNum = parseFloat(amount);
        if (isNaN(amountNum)) {
            const emptyConversions: Record<string, string> = {};
            exchangeRates.forEach((rate) => {
                emptyConversions[rate.code] = '0.00';
            });
            setConvertedAmounts(emptyConversions);
            return;
        }

        const selectedRate =
            exchangeRates.find((rate) => rate.code === selectedCurrency)
                ?.rate ?? 1;

        const amountInUSD =
            selectedCurrency === 'USD' ? amountNum : amountNum / selectedRate;

        const newConvertedAmounts: Record<string, string> = {};
        exchangeRates.forEach((rate) => {
            const convertedAmount = amountInUSD * rate.rate;
            newConvertedAmounts[rate.code] = convertedAmount.toFixed(2);
        });

        setConvertedAmounts(newConvertedAmounts);
    }, [amount, selectedCurrency, exchangeRates]);

    const handleConvert = async () => {
        setIsLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 500));
        calculateConversions();
        setShowResults(true);
        setIsLoading(false);
    };

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAmount(e.target.value);
        setShowResults(false);
    };

    const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCurrency(e.target.value);
        setShowResults(false);
    };

    const handleUpdateRates = async () => {
        try {
            setIsUpdatingRates(true);
            await router.post(
                route('exchange-rates.update'),
                {},
                {
                    only: ['exchangeRates', 'lastUpdated'],
                    preserveScroll: true,
                    onFinish: () => setIsUpdatingRates(false),
                },
            );
        } catch (error) {
            console.error('Failed to update rates:', error);
            setIsUpdatingRates(false);
        }
    };

    const handleCreatePipeline = async () => {
        try {
            await router.post(route('exchange-rates.schedule'), pipelineForm, {
                only: ['pipelines'],
                preserveScroll: true,
                onSuccess: () => {
                    setShowPipelineModal(false);
                    setPipelineForm({
                        name: '',
                        cron: '0 0 * * *',
                        is_active: true,
                    });
                },
                onError: () =>
                    setPipelineError('Invalid pipeline configuration'),
            });
        } catch (error) {
            setPipelineError('Failed to create pipeline');
        }
    };

    const handleTogglePipeline = async (pipeline: Pipeline) => {
        try {
            await router.post(
                route(
                    `exchange-rates.${pipeline.is_active ? 'disable' : 'enable'}`,
                    {
                        pipeline: pipeline.id,
                    },
                ),
                {},
                {
                    only: ['pipelines'],
                    preserveScroll: true,
                },
            );
        } catch (error) {
            console.error('Failed to toggle pipeline:', error);
        }
    };

    return (
        <>
            <Head title="Currency Converter" />

            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 py-12 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="overflow-hidden rounded-xl bg-white/80 p-6 shadow-2xl backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="mb-8 text-center"
                        >
                            <h1 className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-4xl font-bold text-transparent">
                                Currency Converter
                            </h1>
                            <p className="mt-2 text-gray-600">
                                Convert between {exchangeRates.length} world
                                currencies
                            </p>
                            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500">
                                <span>
                                    Last updated:{' '}
                                    {new Date(lastUpdated).toLocaleString()}
                                </span>
                                <button
                                    onClick={handleUpdateRates}
                                    disabled={isUpdatingRates}
                                    className="inline-flex items-center rounded-md bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50"
                                >
                                    {isUpdatingRates ? (
                                        <>
                                            <svg
                                                className="-ml-1 mr-2 h-4 w-4 animate-spin"
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
                                            Updating...
                                        </>
                                    ) : (
                                        'Update Rates'
                                    )}
                                </button>
                                <button
                                    onClick={() => setShowPipelineModal(true)}
                                    className="inline-flex items-center rounded-md bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                                >
                                    Schedule Updates
                                </button>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="mb-8 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 p-6"
                        >
                            <div className="flex flex-col gap-6 sm:flex-row">
                                <div className="flex-1">
                                    <label
                                        htmlFor="amount"
                                        className="mb-2 block text-sm font-medium text-gray-700"
                                    >
                                        Amount
                                    </label>
                                    <div className="relative">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                            <span className="text-gray-500">
                                                {selectedCurrency}
                                            </span>
                                        </div>
                                        <input
                                            type="number"
                                            id="amount"
                                            value={amount}
                                            onChange={handleAmountChange}
                                            className="block w-full rounded-lg border-gray-300 pl-12 shadow-sm transition-colors focus:border-purple-500 focus:ring-purple-500"
                                            min="0"
                                            step="0.01"
                                        />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <label
                                        htmlFor="currency"
                                        className="mb-2 block text-sm font-medium text-gray-700"
                                    >
                                        From Currency
                                    </label>
                                    <select
                                        id="currency"
                                        value={selectedCurrency}
                                        onChange={handleCurrencyChange}
                                        className="block w-full rounded-lg border-gray-300 shadow-sm transition-colors focus:border-purple-500 focus:ring-purple-500"
                                    >
                                        {exchangeRates.map((rate) => (
                                            <option
                                                key={rate.id}
                                                value={rate.code}
                                            >
                                                {rate.code} - {rate.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="mt-6 text-center"
                            >
                                <button
                                    onClick={handleConvert}
                                    disabled={isLoading}
                                    className="inline-flex items-center rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 text-base font-medium text-white shadow-sm transition-all hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50"
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
                                </button>
                            </motion.div>
                        </motion.div>

                        {showResults && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="mb-8"
                            >
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg font-medium text-gray-900">
                                        Conversion Results
                                    </h2>
                                    <button
                                        onClick={() =>
                                            setShowRatesTable(!showRatesTable)
                                        }
                                        className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                                    >
                                        {showRatesTable ? (
                                            <>
                                                Hide Rates
                                                <ChevronUpIcon className="-mr-1 ml-2 h-4 w-4" />
                                            </>
                                        ) : (
                                            <>
                                                Show Rates
                                                <ChevronDownIcon className="-mr-1 ml-2 h-4 w-4" />
                                            </>
                                        )}
                                    </button>
                                </div>

                                <AnimatePresence>
                                    {showRatesTable && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{
                                                opacity: 1,
                                                height: 'auto',
                                            }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{
                                                type: 'spring',
                                                damping: 25,
                                                stiffness: 200,
                                            }}
                                            className="mt-4 overflow-hidden rounded-lg border border-gray-200 bg-white shadow"
                                        >
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
                                                    {exchangeRates.map(
                                                        (rate, index) => (
                                                            <motion.tr
                                                                initial={{
                                                                    opacity: 0,
                                                                    y: 10,
                                                                }}
                                                                animate={{
                                                                    opacity: 1,
                                                                    y: 0,
                                                                }}
                                                                transition={{
                                                                    delay:
                                                                        index *
                                                                        0.05,
                                                                }}
                                                                key={rate.code}
                                                                className="transition-colors hover:bg-gray-50"
                                                            >
                                                                <td className="whitespace-nowrap px-6 py-4">
                                                                    <div className="flex items-center">
                                                                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-purple-100 text-sm font-semibold text-gray-700">
                                                                            {
                                                                                rate.code
                                                                            }
                                                                        </span>
                                                                        <div className="ml-4">
                                                                            <div className="text-sm font-medium text-gray-900">
                                                                                {
                                                                                    rate.name
                                                                                }
                                                                            </div>
                                                                            <div className="text-sm text-gray-500">
                                                                                {
                                                                                    rate.code
                                                                                }
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td className="whitespace-nowrap px-6 py-4">
                                                                    <div className="text-sm font-medium text-gray-900">
                                                                        {
                                                                            rate.code
                                                                        }{' '}
                                                                        {
                                                                            convertedAmounts[
                                                                                rate
                                                                                    .code
                                                                            ]
                                                                        }
                                                                    </div>
                                                                    <div className="text-xs text-gray-500">
                                                                        Rate:{' '}
                                                                        {rate.rate.toFixed(
                                                                            4,
                                                                        )}
                                                                    </div>
                                                                </td>
                                                            </motion.tr>
                                                        ),
                                                    )}
                                                </tbody>
                                            </table>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        )}

                        <div className="mt-8">
                            <h2 className="text-lg font-medium text-gray-900">
                                Scheduled Updates
                            </h2>
                            <div className="mt-4 overflow-hidden rounded-lg border border-gray-200 bg-white shadow">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Name
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Schedule
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Last Run
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {pipelines.map((pipeline) => (
                                            <tr
                                                key={pipeline.id}
                                                className="hover:bg-gray-50"
                                            >
                                                <td className="whitespace-nowrap px-6 py-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {pipeline.name}
                                                    </div>
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4">
                                                    <div className="text-sm text-gray-500">
                                                        {pipeline.cron}
                                                    </div>
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4">
                                                    <div className="text-sm text-gray-500">
                                                        {pipeline.last_run_at
                                                            ? new Date(
                                                                  pipeline.last_run_at,
                                                              ).toLocaleString()
                                                            : 'Never'}
                                                    </div>
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4">
                                                    <span
                                                        className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                                                            pipeline.is_active
                                                                ? 'bg-green-100 text-green-800'
                                                                : 'bg-red-100 text-red-800'
                                                        }`}
                                                    >
                                                        {pipeline.is_active
                                                            ? 'Active'
                                                            : 'Inactive'}
                                                    </span>
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4">
                                                    <button
                                                        onClick={() =>
                                                            handleTogglePipeline(
                                                                pipeline,
                                                            )
                                                        }
                                                        className={`text-sm font-medium ${
                                                            pipeline.is_active
                                                                ? 'text-red-600 hover:text-red-900'
                                                                : 'text-green-600 hover:text-green-900'
                                                        }`}
                                                    >
                                                        {pipeline.is_active
                                                            ? 'Disable'
                                                            : 'Enable'}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        {pipelines.length === 0 && (
                                            <tr>
                                                <td
                                                    colSpan={5}
                                                    className="px-6 py-4 text-center text-sm text-gray-500"
                                                >
                                                    No scheduled updates
                                                    configured
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <Transition.Root show={showPipelineModal} as={Fragment}>
                            <Dialog
                                as="div"
                                className="relative z-10"
                                onClose={setShowPipelineModal}
                            >
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-out duration-300"
                                    enterFrom="opacity-0"
                                    enterTo="opacity-100"
                                    leave="ease-in duration-200"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                                >
                                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                                </Transition.Child>

                                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                                        <Transition.Child
                                            as={Fragment}
                                            enter="ease-out duration-300"
                                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                                            leave="ease-in duration-200"
                                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                        >
                                            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                                                <div>
                                                    <Dialog.Title
                                                        as="h3"
                                                        className="text-center text-lg font-medium leading-6 text-gray-900"
                                                    >
                                                        Create Update Schedule
                                                    </Dialog.Title>
                                                    <div className="mt-3">
                                                        <div className="space-y-4">
                                                            <div>
                                                                <label
                                                                    htmlFor="name"
                                                                    className="block text-sm font-medium text-gray-700"
                                                                >
                                                                    Name
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    id="name"
                                                                    value={
                                                                        pipelineForm.name
                                                                    }
                                                                    onChange={(
                                                                        e,
                                                                    ) =>
                                                                        setPipelineForm(
                                                                            {
                                                                                ...pipelineForm,
                                                                                name: e
                                                                                    .target
                                                                                    .value,
                                                                            },
                                                                        )
                                                                    }
                                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                                                                    placeholder="Daily Update"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label
                                                                    htmlFor="cron"
                                                                    className="block text-sm font-medium text-gray-700"
                                                                >
                                                                    Schedule
                                                                    (Cron
                                                                    Expression)
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    id="cron"
                                                                    value={
                                                                        pipelineForm.cron
                                                                    }
                                                                    onChange={(
                                                                        e,
                                                                    ) =>
                                                                        setPipelineForm(
                                                                            {
                                                                                ...pipelineForm,
                                                                                cron: e
                                                                                    .target
                                                                                    .value,
                                                                            },
                                                                        )
                                                                    }
                                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                                                                    placeholder="0 0 * * *"
                                                                />
                                                                <p className="mt-1 text-xs text-gray-500">
                                                                    Default is
                                                                    daily at
                                                                    midnight (0
                                                                    0 * * *)
                                                                </p>
                                                            </div>
                                                            {pipelineError && (
                                                                <p className="text-sm text-red-600">
                                                                    {
                                                                        pipelineError
                                                                    }
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                                                    <button
                                                        type="button"
                                                        className="inline-flex w-full justify-center rounded-md border border-transparent bg-purple-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm"
                                                        onClick={
                                                            handleCreatePipeline
                                                        }
                                                    >
                                                        Create Schedule
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm"
                                                        onClick={() =>
                                                            setShowPipelineModal(
                                                                false,
                                                            )
                                                        }
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </Dialog.Panel>
                                        </Transition.Child>
                                    </div>
                                </div>
                            </Dialog>
                        </Transition.Root>
                    </motion.div>
                </div>
            </div>
        </>
    );
}
