import {
    Button,
    Dialog,
    DialogPanel,
    DialogTitle,
    Field,
    Fieldset,
    Input,
    Label,
    Transition,
    TransitionChild,
} from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import clsx from 'clsx';
import { Fragment } from 'react';

interface PipelineModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface PipelineData {
    name: string;
    cron: string;
    is_active: boolean;
}

export function PipelineModal({ isOpen, onClose }: PipelineModalProps) {
    const { data, setData, post, processing, errors } = useForm<PipelineData>({
        name: '',
        cron: '0 0 * * *',
        is_active: true,
    });

    const handleCreatePipeline = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('exchange-rates.schedule'), {
            preserveScroll: true,
            onSuccess: () => {
                onClose();
                setData({
                    name: '',
                    cron: '0 0 * * *',
                    is_active: true,
                });
            },
        });
    };

    return (
        <Transition show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={onClose}>
                <TransitionChild
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </TransitionChild>

                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <TransitionChild
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                                <div>
                                    <DialogTitle
                                        as="h3"
                                        className="text-center text-lg font-medium leading-6 text-gray-900"
                                    >
                                        Create Update Schedule
                                    </DialogTitle>
                                    <form
                                        id="create-pipeline"
                                        onSubmit={handleCreatePipeline}
                                    >
                                        <Fieldset className="space-y-4">
                                            <Field>
                                                <Label className="block text-sm font-medium text-gray-700">
                                                    Name
                                                </Label>
                                                <Input
                                                    type="text"
                                                    id="name"
                                                    name="name"
                                                    value={data.name}
                                                    onChange={(e) =>
                                                        setData({
                                                            ...data,
                                                            name: e.target
                                                                .value,
                                                        })
                                                    }
                                                    className={clsx(
                                                        'mt-1 block w-full rounded-md shadow-sm focus:ring-purple-500 sm:text-sm',
                                                        errors.name
                                                            ? 'border-red-500 focus:border-red-500'
                                                            : 'border-gray-300 focus:border-purple-500',
                                                    )}
                                                    placeholder="Daily Update"
                                                />
                                            </Field>
                                            <Field>
                                                <Label className="block text-sm font-medium text-gray-700">
                                                    Schedule (Cron Expression)
                                                </Label>
                                                <Input
                                                    type="text"
                                                    id="cron"
                                                    name="cron"
                                                    value={data.cron}
                                                    onChange={(e) =>
                                                        setData({
                                                            ...data,
                                                            cron: e.target
                                                                .value,
                                                        })
                                                    }
                                                    className={clsx(
                                                        'mt-1 block w-full rounded-md shadow-sm focus:ring-purple-500 sm:text-sm',
                                                        errors.cron
                                                            ? 'border-red-500 focus:border-red-500'
                                                            : 'border-gray-300 focus:border-purple-500',
                                                    )}
                                                    placeholder="0 0 * * *"
                                                />
                                                <p className="mt-1 text-xs text-gray-500">
                                                    Default is daily at midnight
                                                    (0 0 * * *)
                                                </p>
                                            </Field>
                                            {errors.name && (
                                                <p className="text-sm text-red-600">
                                                    {errors.name}
                                                </p>
                                            )}
                                            {errors.cron && (
                                                <p className="text-sm text-red-600">
                                                    {errors.cron}
                                                </p>
                                            )}
                                        </Fieldset>
                                    </form>
                                </div>
                                <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                                    <Button
                                        form="create-pipeline"
                                        type="submit"
                                        className="inline-flex w-full justify-center rounded-md border border-transparent bg-purple-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm"
                                        disabled={processing}
                                    >
                                        {processing
                                            ? 'Creating...'
                                            : 'Create Schedule'}
                                    </Button>
                                    <Button
                                        type="button"
                                        className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm"
                                        onClick={onClose}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
