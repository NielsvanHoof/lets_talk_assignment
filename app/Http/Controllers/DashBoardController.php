<?php

namespace App\Http\Controllers;

use App\Jobs\FetchExchangeRatesJob;
use App\Models\ExchangeRate;
use App\Models\Pipeline;
use Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class DashBoardController extends Controller
{
    public function index()
    {
        $exchangeRates = ExchangeRate::query()->get();

        $pipelines = Auth::check()
            ? Auth::user()->loadExists('pipelines')->pipelines
            : collect();

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
            'user_id' => \Illuminate\Support\Facades\Auth::id(),
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
}
