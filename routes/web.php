<?php

use App\Http\Controllers\DashBoardController;
use App\Http\Controllers\ExchangeRateController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome');
});



Route::prefix('exchange-rates')->middleware(['auth'])->group(function () {
    Route::post('/update', [ExchangeRateController::class, 'update'])->name('exchange-rates.update');
    Route::post('/schedule', [ExchangeRateController::class, 'schedule'])->name('exchange-rates.schedule');
    Route::delete('/schedule/{pipeline}', [ExchangeRateController::class, 'disable'])->name('exchange-rates.disable');
    Route::post('/schedule/{pipeline}', [ExchangeRateController::class, 'enable'])->name('exchange-rates.enable');
});

Route::get('/dashboard', DashBoardController::class)->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
