<?php

use App\Models\AllowedIpAddresses;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('login screen can be rendered when the users ip is in the whitelist', function () {
    $allowedIp = '127.0.0.1';
    AllowedIpAddresses::factory()->create([
        'ip_address' => $allowedIp,
        'is_active' => true,
    ]);

    $response = $this->withServerVariables(['REMOTE_ADDR' => $allowedIp])
        ->get('/login');

    $response->assertInertia(
        fn (Assert $page) => $page
            ->component('Auth/Login')
            ->has('status')
            ->has('canResetPassword')
            ->has('auth.user', null)
    );
});

test('users can authenticate using the login screen', function () {
    $user = User::factory()->create();

    $allowedIp = '127.0.0.1';
    AllowedIpAddresses::factory()->create([
        'ip_address' => $allowedIp,
        'is_active' => true,
    ]);

    $response = $this->withServerVariables(['REMOTE_ADDR' => $allowedIp])
        ->post('/login', [
            'email' => $user->email,
            'password' => 'password',
        ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('ip-addresses.index', absolute: false));
});

test('users can not authenticate with invalid password', function () {
    $user = User::factory()->create();

    $allowedIp = '127.0.0.1';
    AllowedIpAddresses::factory()->create([
        'ip_address' => $allowedIp,
        'is_active' => true,
    ]);

    $response = $this->withServerVariables(['REMOTE_ADDR' => $allowedIp])
        ->post('/login', [
            'email' => $user->email,
            'password' => 'wrong-password',
        ]);

    $this->assertGuest();
    $response->assertInvalid(['email']);
});

test('users can logout', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)
        ->post('/logout');

    $this->assertGuest();
    $response->assertRedirect('/');
});
