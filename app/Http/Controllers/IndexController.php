<?php

namespace App\Http\Controllers;

use App\Models\ExchangeRate;
use Illuminate\Http\Request;
use Inertia\Inertia;

class IndexController extends Controller
{
    public function __invoke()
    {
        $exchangeRates = ExchangeRate::query()->get();

        return Inertia::render('Welcome', [
            'exchangeRates' => $exchangeRates,
        ]);
    }
}
