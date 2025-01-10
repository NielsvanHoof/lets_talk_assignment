<?php

use App\Console\Commands\UpdateExchangeRates;
use Illuminate\Support\Facades\Schedule;

Schedule::command(UpdateExchangeRates::class)->dailyAt('12:00')->withoutOverlapping()->onOneServer();
