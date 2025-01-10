<?php

use App\Console\Commands\RunPipelinesCommand;
use App\Jobs\FetchExchangeRatesJob;
use Illuminate\Support\Facades\Schedule;

Schedule::job(new FetchExchangeRatesJob)->dailyAt('12:00')->withoutOverlapping()->onOneServer();

Schedule::command(RunPipelinesCommand::class)->everyMinute()->withoutOverlapping()->onOneServer();