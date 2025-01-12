<?php

use App\Models\AllowedIpAddresses;
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


    $response->assertStatus(200);
});

test('dashboard page is forbidden with disallowed IP', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)
        ->withServerVariables(['REMOTE_ADDR' => '192.168.1.1'])
        ->get(route('dashboard'));

    $response->assertStatus(403);
});

