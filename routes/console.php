<?php

use App\Jobs\FetchExchangeRatesJob;
use Illuminate\Support\Facades\Schedule;

Schedule::job(new FetchExchangeRatesJob)->dailyAt('12:00');
