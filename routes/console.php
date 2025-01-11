<?php

use App\Jobs\FetchExchangeRatesJob;
use App\Jobs\ProcessPipeLineJob;
use App\Models\Pipeline;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Schedule;

Schedule::job(new FetchExchangeRatesJob)->dailyAt('12:00')->withoutOverlapping()->onOneServer();

Pipeline::query()->where([
    'is_active' => true,
    'is_scheduled' => true,
])->chunk(100, function (Collection $pipelines) {
    $pipelines->each(function (Pipeline $pipeline) {
        Schedule::job(new ProcessPipeLineJob($pipeline))->cron($pipeline->cron_expression)->withoutOverlapping()->onOneServer();
    });
});
