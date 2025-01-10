<?php

namespace App\Http\Controllers;

use App\Models\ExchangeRate;
use Auth;
use Inertia\Inertia;

class DashBoardController extends Controller
{
    public function __invoke()
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
}
