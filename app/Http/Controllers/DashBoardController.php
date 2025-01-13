<?php

namespace App\Http\Controllers;

use App\Jobs\FetchExchangeRatesJob;
use App\Models\ExchangeRate;
use App\Models\Pipeline;
use App\Services\CurrencyConverterService;
use Auth;
use Cache;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class DashBoardController extends Controller
{
    public function index()
    {
        $exchangeRates = Cache::flexible('exchange-rates', [60, 120], function () {
            return ExchangeRate::query()->latest()->get();
        });

        $pipelines = Auth::user()->loadExists('pipelines')->pipelines;

        return Inertia::render('Dashboard', [
            'exchangeRates' => $exchangeRates,
            'pipelines' => $pipelines,
            'lastUpdated' => $pipelines->last()->updated_at ?? null,
        ]);
    }

    public function update()
    {
        FetchExchangeRatesJob::dispatchSync();

        return Redirect::back()->with([
            'status' => 'success',
            'message' => 'Exchange rates updated successfully',
        ]);
    }

    public function schedule(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string',
            'cron_expression' => 'required|string',
            'is_active' => 'required|boolean',
            'is_scheduled' => 'required|boolean',
        ]);

        Pipeline::create([
            ...$data,
            'user_id' => Auth::id(),
        ]);

        return Redirect::back()->with([
            'status' => 'success',
            'message' => 'Schedule created successfully',
        ]);
    }

    public function disable(Pipeline $pipeline)
    {
        $pipeline->update(['is_active' => false]);

        return Redirect::back()->with([
            'status' => 'success',
            'message' => 'Schedule disabled successfully',
        ]);
    }

    public function enable(Pipeline $pipeline)
    {
        $pipeline->update(['is_active' => true]);

        return Redirect::back()->with([
            'status' => 'success',
            'message' => 'Schedule enabled successfully',
        ]);
    }

    public function convert(Request $request)
    {
        try {
            $data = $request->validate([
                'amount' => ['required', 'numeric', 'min:0', 'max:999999999'],
                'from_currency' => ['required', 'string', 'size:3'],
            ]);

            \Log::info('Currency conversion requested', [
                'user_id' => Auth::id(),
                'ip' => $request->ip(),
                'amount' => $data['amount'],
                'from_currency' => $data['from_currency'],
            ]);

            $service = new CurrencyConverterService(
                amount: (float) $data['amount'],
                fromCurrency: strtoupper($data['from_currency'])
            );

            $result = $service->convert();

            \Log::info('Currency conversion successful', [
                'user_id' => Auth::id(),
                'conversion_count' => count($result['conversions']),
                'timestamp' => $result['timestamp'],
            ]);

            return response()->json($result);
        } catch (\Illuminate\Validation\ValidationException $e) {
            \Log::warning('Currency conversion validation failed', [
                'user_id' => Auth::id(),
                'errors' => $e->errors(),
                'amount' => $request->input('amount'),
                'from_currency' => $request->input('from_currency'),
            ]);

            return response()->json([
                'error' => 'Validation failed',
                'code' => 'VALIDATION_ERROR',
                'errors' => $e->errors(),
            ], 422);
        } catch (\InvalidArgumentException $e) {
            \Log::warning('Currency conversion validation failed', [
                'user_id' => Auth::id(),
                'error' => $e->getMessage(),
                'amount' => $data['amount'] ?? null,
                'from_currency' => $data['from_currency'] ?? null,
            ]);

            return response()->json([
                'error' => 'Invalid conversion request: '.$e->getMessage(),
                'code' => 'VALIDATION_ERROR',
            ], 422);
        } catch (\RuntimeException $e) {
            \Log::error('Currency conversion failed', [
                'user_id' => Auth::id(),
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'error' => 'The conversion service is temporarily unavailable. Please try again later.',
                'code' => 'SERVICE_ERROR',
                'debug' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        } catch (\Exception $e) {
            \Log::critical('Unexpected error during currency conversion', [
                'user_id' => Auth::id(),
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'error' => 'An unexpected error occurred. Our team has been notified.',
                'code' => 'UNEXPECTED_ERROR',
                'debug' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }
}
