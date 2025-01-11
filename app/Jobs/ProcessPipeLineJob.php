<?php

namespace App\Jobs;

use App\Models\ExchangeRate;
use App\Models\Pipeline;
use Http;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Log;

class ProcessPipeLineJob implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(public Pipeline $pipeline)
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        Log::info('Processing pipeline', ['pipeline' => $this->pipeline]);

        $response = Http::get(config(key: 'exchange.api_feed'));

        $data = $response->json();

        Log::info('Fetching exchange rates', ['data' => $data]);

        $rates = [];

        foreach ($data as $code => $rate) {
            $rates[] = [
                'code' => $code,
                'alphaCode' => $rate['alphaCode'],
                'name' => $rate['name'],
                'rate' => $rate['rate'],
                'date' => $rate['date'],
                'inverseRate' => $rate['inverseRate'],
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        $amountUpdated = ExchangeRate::query()->upsert($rates,
            ['code', 'alphaCode'],
            ['rate', 'inverseRate', 'updated_at', 'date']
        );

        Log::info('Exchange rates fetched successfully');

        Log::info('Updated exchange rates', ['count' => $amountUpdated]);

        $this->pipeline->update([
            'last_run_at' => now(),
            'next_run_at' => now()->addMinutes(1),
        ]);

        Log::info('Pipeline processed successfully');
    }
}
