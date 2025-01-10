<?php

use App\Http\Controllers\DashBoardController;
use App\Http\Controllers\ExchangeRateController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\IpAddressController;
use App\Http\Controllers\UserController;
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

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', DashBoardController::class)->name('dashboard');
    Route::post('/exchange-rates/update', [ExchangeRateController::class, 'update'])->name('exchange-rates.update');
    Route::post('/exchange-rates/schedule', [ExchangeRateController::class, 'schedule'])->name('exchange-rates.schedule');
    Route::post('/exchange-rates/{pipeline}/enable', [ExchangeRateController::class, 'enable'])->name('exchange-rates.enable');
    Route::delete('/exchange-rates/{pipeline}/disable', [ExchangeRateController::class, 'disable'])->name('exchange-rates.disable');

    Route::get('/ip-addresses', [IpAddressController::class, 'index'])->name('ip-addresses.index');
    Route::post('/ip-addresses', [IpAddressController::class, 'store'])->name('ip-addresses.store');
    Route::delete('/ip-addresses/{ipAddress}', [IpAddressController::class, 'destroy'])->name('ip-addresses.destroy');

    Route::get('/users', [UserController::class, 'index'])->name('users.index');
    Route::post('/users', [UserController::class, 'store'])->name('users.store');
    Route::delete('/users/{user}', [UserController::class, 'destroy'])->name('users.destroy');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
