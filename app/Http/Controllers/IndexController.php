<?php

namespace App\Http\Controllers;

use App\Models\ExchangeRate;
use App\Models\Pipeline;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class IndexController extends Controller
{
    public function __invoke()
    {
        $exchangeRates = ExchangeRate::query()->get();


        $pipelines = Auth::user()->with('pipelines')->get();


        return Inertia::render('Welcome', [
            'exchangeRates' => $exchangeRates,
            'pipelines' => $pipelines,
            'lastUpdated' => $pipelines->last()->updated_at ?? null,
        ]);
    }
}
