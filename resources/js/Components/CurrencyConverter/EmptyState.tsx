import { Button } from '@headlessui/react';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

interface EmptyStateProps {
    onUpdate: () => void;
    isUpdating: boolean;
}

export function EmptyState({ onUpdate, isUpdating }: EmptyStateProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-lg bg-white p-12 text-center shadow-sm"
        >
            <ArrowPathIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">
                No exchange rates available
            </h3>
            <p className="mt-1 text-sm text-gray-500">
                Get started by fetching the latest exchange rates.
            </p>
            <div className="mt-6">
                <Button
                    type="button"
                    onClick={onUpdate}
                    disabled={isUpdating}
                    className="inline-flex items-center rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isUpdating ? (
                        <>
                            <ArrowPathIcon className="-ml-1 mr-2 h-5 w-5 animate-spin" />
                            Updating Rates...
                        </>
                    ) : (
                        <>
                            <ArrowPathIcon className="-ml-1 mr-2 h-5 w-5" />
                            Update Rates
                        </>
                    )}
                </Button>
            </div>
        </motion.div>
    );
}
