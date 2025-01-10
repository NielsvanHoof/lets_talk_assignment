<?php

namespace App\Jobs;

use App\Models\ExchangeRate;
use App\Models\Pipeline;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class FetchExchangeRatesJob implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
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
            ];
        }

        ExchangeRate::query()->insert($rates);

        Log::info('Exchange rates fetched successfully');
    }
}