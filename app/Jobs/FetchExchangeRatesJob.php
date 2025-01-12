<?php

namespace App\Jobs;

use App\Models\ExchangeRate;
use Cache;
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
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        $amountUpdated = ExchangeRate::query()->upsert($rates,
            ['code', 'alphaCode', 'date'],
            ['rate', 'inverseRate', 'updated_at', 'date']
        );

        Log::info('Exchange rates fetched successfully');

        Log::info('Updated exchange rates', ['count' => $amountUpdated]);

        Cache::forget('exchange-rates');
    }
}
