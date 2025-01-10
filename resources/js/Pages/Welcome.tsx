import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';

export default function Welcome() {
    return (
        <div className="relative min-h-screen bg-gradient-to-br from-gray-50 to-white">
            <div className="mx-auto max-w-7xl px-4 py-32 sm:px-6 lg:px-8">
                <div className="text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-5xl font-bold text-transparent sm:text-6xl"
                    >
                        Currency Converter
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="mx-auto mt-4 max-w-2xl text-lg text-gray-600"
                    >
                        Convert between multiple currencies with real-time
                        exchange rates. Create schedules to automatically update
                        rates.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mt-8 flex justify-center gap-4"
                    >
                        <Link
                            href={route('login')}
                            className="inline-flex items-center rounded-md bg-purple-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                        >
                            Get Started
                        </Link>
                        <Link
                            href={route('register')}
                            className="inline-flex items-center rounded-md bg-white px-6 py-3 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                        >
                            Create Account
                        </Link>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="mt-12"
                    >
                        <h2 className="text-lg font-semibold text-gray-900">
                            Features
                        </h2>
                        <div className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                            <div className="rounded-lg bg-white p-6 shadow-sm">
                                <h3 className="text-base font-medium text-gray-900">
                                    Real-time Conversions
                                </h3>
                                <p className="mt-2 text-sm text-gray-500">
                                    Convert between multiple currencies using
                                    up-to-date exchange rates.
                                </p>
                            </div>
                            <div className="rounded-lg bg-white p-6 shadow-sm">
                                <h3 className="text-base font-medium text-gray-900">
                                    Scheduled Updates
                                </h3>
                                <p className="mt-2 text-sm text-gray-500">
                                    Create custom schedules to automatically
                                    update exchange rates.
                                </p>
                            </div>
                            <div className="rounded-lg bg-white p-6 shadow-sm">
                                <h3 className="text-base font-medium text-gray-900">
                                    Multiple Currencies
                                </h3>
                                <p className="mt-2 text-sm text-gray-500">
                                    Support for a wide range of world currencies
                                    with detailed information.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
