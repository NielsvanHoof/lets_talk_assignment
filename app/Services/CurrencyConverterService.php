<?php

namespace App\Services;

use App\Models\ExchangeRate;
use Cache;
use Illuminate\Database\Eloquent\Collection;
use InvalidArgumentException;
use RuntimeException;

class CurrencyConverterService
{
    private const CACHE_KEY = 'exchange-rates';

    private const PRECISION = 2;

    private const CACHE_TTL = 3600; // 1 hour

    public function __construct(
        private readonly float $amount,
        private readonly string $fromCurrency
    ) {}

    /**
     * @return array<string, array{conversions: array<string, array{amount: float, rate: float, name: string}>, timestamp: string, base_currency: string, source_amount: float, source_currency: string}>
     */
    public function convert(): array
    {
        try {
            $exchangeRates = $this->getExchangeRates();
            $fromRate = $this->getFromRate($exchangeRates);

            $usdAmount = $this->convertToUsd($fromRate);
            $conversions = $this->convertToAllCurrencies($exchangeRates, $usdAmount);

            return [
                'conversions' => $conversions,
                'timestamp' => now()->toIso8601String(),
                'base_currency' => 'USD',
                'source_amount' => $this->amount,
                'source_currency' => $this->fromCurrency,
            ];
        } catch (InvalidArgumentException $e) {
            throw $e;
        } catch (\Exception $e) {
            throw new RuntimeException('Failed to perform currency conversion: '.$e->getMessage());
        }
    }

    /**
     * @return Collection<ExchangeRate>
     */
    private function getExchangeRates(): Collection
    {
        return Cache::remember(self::CACHE_KEY, self::CACHE_TTL, function () {
            $rates = ExchangeRate::query()->latest()->get();

            if ($rates->isEmpty()) {
                throw new RuntimeException('No exchange rates available');
            }

            return $rates;
        });
    }

    /**
     * @param  Collection<ExchangeRate>  $exchangeRates
     */
    private function getFromRate(Collection $exchangeRates): ExchangeRate
    {
        $fromRate = $exchangeRates->firstWhere('alphaCode', strtoupper($this->fromCurrency));

        if (! $fromRate) {
            throw new InvalidArgumentException("Invalid source currency: {$this->fromCurrency}");
        }

        return $fromRate;
    }

    private function convertToUsd(ExchangeRate $fromRate): float
    {
        if ($this->fromCurrency === 'USD') {
            return $this->amount;
        }

        if ($fromRate->rate <= 0) {
            throw new InvalidArgumentException("Invalid exchange rate for {$this->fromCurrency}");
        }

        return $this->amount / $fromRate->rate;
    }

    /**
     * @param  Collection<ExchangeRate>  $exchangeRates
     * @return array<string, array{amount: float, rate: float, name: string}>
     */
    private function convertToAllCurrencies(Collection $exchangeRates, float $usdAmount): array
    {
        $conversions = [];
        foreach ($exchangeRates as $rate) {
            if ($rate->rate <= 0) {
                continue;
            }

            $convertedAmount = $rate->alphaCode === 'USD'
                ? $usdAmount
                : $usdAmount * $rate->rate;

            $conversions[$rate->alphaCode] = [
                'amount' => round($convertedAmount, self::PRECISION),
                'rate' => round($rate->rate, self::PRECISION),
                'name' => $rate->name,
            ];
        }

        if (empty($conversions)) {
            throw new RuntimeException('No valid conversion rates available');
        }

        return $conversions;
    }
}
