<?php

namespace App\Http\Controllers;

use App\Jobs\FetchExchangeRatesJob;
use App\Models\Pipeline;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;

class ExchangeRateController extends Controller
{
    public function update()
    {
        FetchExchangeRatesJob::dispatchSync();

        return Redirect::back()->with('success', 'Exchange rates updated successfully');
    }

    public function schedule(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string',
            'cron' => 'required|string',
            'is_active' => 'required|boolean',
        ]);


        Pipeline::create([
            ...$data,
            'user_id' => Auth::check() ? Auth::id() : 1,
        ]);

        return Redirect::back()->with('success', 'Schedule created successfully');
    }

    public function disable(Pipeline $pipeline)
    {
        $pipeline->update(['is_active' => false]);

        return Redirect::back()->with('success', 'Schedule disabled successfully');
    }

    public function enable(Pipeline $pipeline)
    {
        $pipeline->update(['is_active' => true]);

        return Redirect::back()->with('success', 'Schedule enabled successfully');
    }
}
