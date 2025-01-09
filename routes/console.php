<?php

use App\Jobs\FetchExchangeRatesJob;
use Illuminate\Support\Facades\Schedule;

// exchange rates are updated daily at 12:00 AM
Schedule::job(new FetchExchangeRatesJob)->dailyAt('12:00');
