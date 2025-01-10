<?php

namespace App\Console\Commands;

use App\Jobs\FetchExchangeRatesJob;
use App\Models\Pipeline;
use Bus;
use Illuminate\Console\Command;

class RunPipelinesCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:run-pipelines-command';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $pipelines = Pipeline::where([
            'is_active' => true,
            'is_scheduled' => true,
            'next_run_at' => '<=',
            now(),
        ])->get();

        $this->info("Found {$pipelines->count()} pipelines to run");

        $jobs = [];
        foreach ($pipelines->chunk(10) as $chunk) {
            $batchJobs = [];
            foreach ($chunk as $pipeline) {
                $this->info("Running pipeline {$pipeline->id}");
                $batchJobs[] = new FetchExchangeRatesJob();
            }
            $jobs[] = $batchJobs;
        }

        foreach ($jobs as $batch) {
            Bus::batch($batch)->dispatch();
        }
    }
}

