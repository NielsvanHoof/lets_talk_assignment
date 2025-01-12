import { Button } from '@headlessui/react';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { PipelineModal } from './PipelineModal';

interface HeaderProps {
    lastUpdated: string | null;
}

export function Header({ lastUpdated }: HeaderProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    const auth = usePage().props.auth;

    const handleUpdateRates = async () => {
        setIsUpdating(true);
        try {
            router.post(
                route('exchange-rates.update'),
                {},
                {
                    preserveScroll: true,
                    onFinish: () => {
                        setIsUpdating(false);
                    },
                },
            );
        } catch (error) {
            console.error('Failed to update rates:', error);
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="mb-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-3xl font-bold text-transparent">
                        Currency Converter
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Last updated:{' '}
                        {lastUpdated
                            ? new Date(lastUpdated).toLocaleString()
                            : 'Never'}
                    </p>
                </div>
                <div className="flex items-center space-x-4">
                    {auth?.user ? (
                        <>
                            <Button
                                onClick={handleUpdateRates}
                                disabled={isUpdating}
                                className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                            >
                                <ArrowPathIcon
                                    className={`-ml-0.5 mr-2 h-4 w-4 ${
                                        isUpdating ? 'animate-spin' : ''
                                    }`}
                                />
                                Update Rates
                            </Button>
                            <Button
                                onClick={() => setIsModalOpen(true)}
                                className="inline-flex items-center rounded-md bg-purple-600 px-3 py-2 text-sm font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                            >
                                Schedule Updates
                            </Button>
                            <Link
                                href={route('logout')}
                                as="button"
                                method="post"
                                className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                            >
                                Logout
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link
                                href={route('login')}
                                className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                            >
                                Login
                            </Link>
                            <Link
                                href={route('register')}
                                className="inline-flex items-center rounded-md bg-purple-600 px-3 py-2 text-sm font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                            >
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </div>

            <PipelineModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
}
