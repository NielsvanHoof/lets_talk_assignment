<?php

use App\Models\ExchangeRate;
use App\Services\CurrencyConverterService;
use Illuminate\Support\Facades\Cache;

beforeEach(function () {
    Cache::flush();

    ExchangeRate::factory()->createMany([
        [
            'alphaCode' => 'USD',
            'name' => 'US Dollar',
            'rate' => 1.0,
        ],
        [
            'alphaCode' => 'EUR',
            'name' => 'Euro',
            'rate' => 0.85,
        ],
        [
            'alphaCode' => 'GBP',
            'name' => 'British Pound',
            'rate' => 0.73,
        ],
    ]);
});

test('it integrates with database and cache for USD conversions', function () {
    $service = new CurrencyConverterService(
        amount: 100,
        fromCurrency: 'USD'
    );

    $result = $service->convert();

    expect($result)
        ->toHaveKey('conversions')
        ->toHaveKey('timestamp')
        ->and($result['conversions'])->toHaveCount(3)
        ->and($result['conversions']['EUR']['amount'])->toBe(85.00);

    expect(Cache::has('exchange-rates'))->toBeTrue();

    $cachedResult = $service->convert();
    expect($cachedResult)->toEqual($result);
});

test('it updates cache when exchange rates change', function () {
    $service = new CurrencyConverterService(
        amount: 100,
        fromCurrency: 'USD'
    );

    $initialResult = $service->convert();

    ExchangeRate::where('alphaCode', 'EUR')
        ->update(['rate' => 0.95]);

    Cache::flush();

    $updatedResult = $service->convert();

    expect($updatedResult['conversions']['EUR']['amount'])
        ->toBe(95.00)
        ->not->toBe($initialResult['conversions']['EUR']['amount']);
});

test('it handles database unavailability gracefully', function () {
    ExchangeRate::query()->delete();
    Cache::flush();

    $service = new CurrencyConverterService(
        amount: 100,
        fromCurrency: 'USD'
    );

    expect(fn () => $service->convert())
        ->toThrow(\RuntimeException::class, 'No exchange rates available');
});

test('it maintains data consistency between cache and database', function () {
    $service = new CurrencyConverterService(
        amount: 100,
        fromCurrency: 'USD'
    );

    $service->convert();

    ExchangeRate::factory()->create([
        'alphaCode' => 'JPY',
        'name' => 'Japanese Yen',
        'rate' => 110.0,
    ]);

    Cache::flush();

    $result = $service->convert();

    expect($result['conversions'])
        ->toHaveCount(4)
        ->toHaveKey('JPY');
});

test('it handles invalid currency codes gracefully', function () {
    $service = new CurrencyConverterService(100, 'INVALID');
    expect(fn () => $service->convert())
        ->toThrow(\InvalidArgumentException::class, 'Invalid source currency: INVALID');
});
