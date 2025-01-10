<?php

namespace App\Console\Commands;

use App\Jobs\FetchExchangeRatesJob;
use App\Models\Pipeline;
use Illuminate\Console\Command;
use Cron\CronExpression;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Bus;

class UpdateExchangeRates extends Command
{
    protected $signature = 'exchange-rates:update';
    protected $description = 'Update exchange rates if scheduled';

    public function handle(): void
    {
        $this->info('Updating exchange rates...');

        $pipelines = Pipeline::where([
            'is_scheduled' => true,
            'is_active' => true,
        ])->get();

        $this->info("Found {$pipelines->count()} pipelines to update");

        $pipelines->chunk(100)->lazy()->each(function (Collection $pipelines) {
            $jobs = $pipelines->map(function (Pipeline $pipeline) {
                $this->info("Dispatching job for pipeline {$pipeline->id}");

                return new FetchExchangeRatesJob();
            });

            Bus::batch($jobs)->dispatch();
        });

        $this->info('Dispatching jobs for pipelines...');
    }
}

