import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { IpAddress } from '@/types/models';
import { Button } from '@headlessui/react';
import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';

interface IpAddressesProps {
    ip_addresses: IpAddress[];
}

export default function IpAddresses({ ip_addresses }: IpAddressesProps) {
    const [showAddForm, setShowAddForm] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        ip_address: '',
        description: '',
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('ip-addresses.store'), {
            onSuccess: () => {
                reset();
                setShowAddForm(false);
            },
        });
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this IP address?')) {
            router.delete(route('ip-addresses.destroy', { id }));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    IP Address Management
                </h2>
            }
        >
            <Head title="IP Addresses" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="mb-6 flex justify-between">
                                <h3 className="text-lg font-medium text-gray-900">
                                    Allowed IP Addresses
                                </h3>
                                <Button
                                    onClick={() => setShowAddForm(!showAddForm)}
                                    className="inline-flex items-center rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                                >
                                    {showAddForm ? 'Cancel' : 'Add IP Address'}
                                </Button>
                            </div>

                            {showAddForm && (
                                <form
                                    onSubmit={handleSubmit}
                                    className="mb-6 space-y-4 rounded-lg bg-gray-50 p-4"
                                >
                                    <div>
                                        <label
                                            htmlFor="ip_address"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            IP Address
                                        </label>
                                        <input
                                            type="text"
                                            id="ip_address"
                                            value={data.ip_address}
                                            onChange={(e) =>
                                                setData(
                                                    'ip_address',
                                                    e.target.value,
                                                )
                                            }
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                                            placeholder="192.168.1.1"
                                        />
                                        {errors.ip_address && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.ip_address}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="description"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Description
                                        </label>
                                        <input
                                            type="text"
                                            id="description"
                                            value={data.description}
                                            onChange={(e) =>
                                                setData(
                                                    'description',
                                                    e.target.value,
                                                )
                                            }
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                                            placeholder="Office IP"
                                        />
                                        {errors.description && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.description}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex justify-end">
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                            className="inline-flex items-center rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                                        >
                                            {processing ? 'Adding...' : 'Add'}
                                        </Button>
                                    </div>
                                </form>
                            )}

                            <div className="overflow-hidden rounded-lg border border-gray-200">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                IP Address
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Description
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Added
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {ip_addresses.map((ip) => (
                                            <tr key={ip.id}>
                                                <td className="whitespace-nowrap px-6 py-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {ip.ip_address}
                                                    </div>
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4">
                                                    <div className="text-sm text-gray-500">
                                                        {ip.description}
                                                    </div>
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4">
                                                    <div className="text-sm text-gray-500">
                                                        {new Date(
                                                            ip.created_at,
                                                        ).toLocaleDateString()}
                                                    </div>
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4">
                                                    <Button
                                                        onClick={() =>
                                                            handleDelete(ip.id)
                                                        }
                                                        className="text-sm font-medium text-red-600 hover:text-red-900"
                                                    >
                                                        Delete
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                        {ip_addresses.length === 0 && (
                                            <tr>
                                                <td
                                                    colSpan={4}
                                                    className="px-6 py-4 text-center text-sm text-gray-500"
                                                >
                                                    No IP addresses added yet
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
