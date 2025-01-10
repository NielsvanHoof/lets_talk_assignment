import { Pipeline } from '@/types/models';
import { Button } from '@headlessui/react';
import { router } from '@inertiajs/react';

interface PipelineTableProps {
    pipelines: Pipeline[];
}

export function PipelineTable({ pipelines }: PipelineTableProps) {
    const handleTogglePipeline = async (pipeline: Pipeline) => {
        try {
            router.post(
                route(
                    `exchange-rates.${pipeline.is_active ? 'disable' : 'enable'}`,
                    {
                        pipeline: pipeline.id,
                    },
                ),
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
                            <tr key={pipeline.id} className="hover:bg-gray-50">
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
                                    <Button
                                        onClick={() =>
                                            handleTogglePipeline(pipeline)
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
                                    </Button>
                                </td>
                            </tr>
                        ))}
                        {pipelines.length === 0 && (
                            <tr>
                                <td
                                    colSpan={5}
                                    className="px-6 py-4 text-center text-sm text-gray-500"
                                >
                                    No scheduled updates configured
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
