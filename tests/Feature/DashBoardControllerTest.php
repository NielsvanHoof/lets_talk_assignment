<?php

use App\Jobs\FetchExchangeRatesJob;
use App\Models\AllowedIpAddresses;
use App\Models\Pipeline;
use App\Models\User;

test('dashboard page is accessible with allowed IP', function () {
    $user = User::factory()->create();

    $allowedIp = '127.0.0.1';
    AllowedIpAddresses::factory()->create([
        'ip_address' => $allowedIp,
        'is_active' => true,
    ]);

    $response = $this->actingAs($user)
        ->withServerVariables(['REMOTE_ADDR' => $allowedIp])
        ->get(route('dashboard'));


    $response->assertOk();
});

test('dashboard page is forbidden with disallowed IP', function () {
    $user = User::factory()->create();

    $forbiddenIp = '192.168.1.1';

    $response = $this->actingAs($user)
        ->withServerVariables(['REMOTE_ADDR' => $forbiddenIp])
        ->get(route('dashboard'));

    $response->assertForbidden();
});

test('the schedule action creates a pipeline and redirects back', function () {
    $user = User::factory()->create();

    $allowedIp = '127.0.0.1';
    AllowedIpAddresses::factory()->create([
        'ip_address' => $allowedIp,
        'is_active' => true,
    ]);

    $data = [
        'name' => 'Test Pipeline',
        'cron_expression' => '* * * * *',
        'is_active' => true,
        'is_scheduled' => true,
    ];


    $response = $this->actingAs($user)
        ->withServerVariables(['REMOTE_ADDR' => $allowedIp])
        ->post(route('exchange-rates.schedule'), $data);

    $response->assertRedirect();
    $response->assertSessionHas('status', 'success');
    $response->assertSessionHas('message', 'Schedule created successfully');
});

test('the enable action enables a pipeline and redirects back', function () {
    $user = User::factory()->create();

    $allowedIp = '127.0.0.1';
    AllowedIpAddresses::factory()->create([
        'ip_address' => $allowedIp,
        'is_active' => true,
    ]);

    $pipeline = Pipeline::factory()->create([
        'is_active' => false,
    ]);

    $response = $this->actingAs($user)
        ->withServerVariables(['REMOTE_ADDR' => $allowedIp])
        ->post(route('exchange-rates.enable', $pipeline));

    $response->assertRedirect();

    $pipeline->refresh();

    $this->assertTrue($pipeline->is_active);

    $response->assertSessionHas('status', 'success');
    $response->assertSessionHas('message', 'Schedule enabled successfully');
});


test('the disable action disables a pipeline and redirects back', function () {
    $user = User::factory()->create();

    $allowedIp = '127.0.0.1';
    AllowedIpAddresses::factory()->create([
        'ip_address' => $allowedIp,
        'is_active' => true,
    ]);

    $pipeline = Pipeline::factory()->create([
        'is_active' => true,
    ]);

    $response = $this->actingAs($user)
        ->withServerVariables(['REMOTE_ADDR' => $allowedIp])
        ->post(route('exchange-rates.disable', $pipeline));

    $response->assertRedirect();

    $pipeline->refresh();

    $this->assertFalse($pipeline->is_active);

    $response->assertSessionHas('status', 'success');
    $response->assertSessionHas('message', 'Schedule disabled successfully');
});

test('the update method runs the FetchExchangeRatesJob synchronously', function () {
    Queue::fake();

    $user = User::factory()->create();


    $allowedIp = '127.0.0.1';
    AllowedIpAddresses::factory()->create([
        'ip_address' => $allowedIp,
        'is_active' => true,
    ]);

    $response = $this->actingAs($user)
        ->withServerVariables(['REMOTE_ADDR' => $allowedIp])
        ->post(route('exchange-rates.update'));

    $response->assertRedirect();

    Queue::assertPushed(FetchExchangeRatesJob::class);
});
