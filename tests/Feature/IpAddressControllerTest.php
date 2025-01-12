<?php

use App\Models\AllowedIpAddresses;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->actingAs($this->user);
});

test('the ip address index page is accessible', function () {
    AllowedIpAddresses::factory()->count(3)->create([
        'user_id' => $this->user->id,
    ]);

    $response = $this->get(route('ip-addresses.index'));

    $response->assertInertia(
        fn (Assert $page) => $page
            ->component('IpAddresses/Index')
            ->has('ip_addresses', 3)
            ->has(
                'ip_addresses.0',
                fn (Assert $page) => $page
                    ->has('id')
                    ->has('ip_address')
                    ->has('description')
                    ->has('is_active')
                    ->has('user_id')
                    ->has('created_at')
                    ->has('updated_at')
            )
    );
});

test('an IP address can be added', function () {
    $data = [
        'ip_address' => '192.168.1.10',
        'description' => 'Test IP Address',
        'is_active' => 1,
    ];

    $response = $this->post(route('ip-addresses.store'), $data);

    $response->assertRedirect();
    $response->assertSessionHas([
        'status' => 'success',
        'message' => 'IP address added successfully',
    ]);

    $this->assertDatabaseHas('allowed_ip_addresses', $data);

    $response = $this->get(route('ip-addresses.index'));
    $response->assertInertia(
        fn (Assert $page) => $page
            ->component('IpAddresses/Index')
            ->has('ip_addresses', 1)
    );
});

test('invalid IP addresses are rejected', function () {
    $data = [
        'ip_address' => 'invalid-ip',
        'description' => 'Test IP Address',
        'is_active' => true,
    ];

    $response = $this->post(route('ip-addresses.store'), $data);

    $response->assertSessionHasErrors(['ip_address']);
    $this->assertDatabaseMissing('allowed_ip_addresses', $data);
});

test('an IP address can be removed', function () {
    $ipAddress = AllowedIpAddresses::factory()->create([
        'user_id' => $this->user->id,
    ]);

    $response = $this->delete(route('ip-addresses.destroy', $ipAddress));

    $response->assertRedirect();
    $response->assertSessionHas([
        'status' => 'success',
        'message' => 'IP address removed successfully',
    ]);

    $this->assertDatabaseMissing('allowed_ip_addresses', [
        'id' => $ipAddress->id,
    ]);

    $response = $this->get(route('ip-addresses.index'));
    $response->assertInertia(
        fn (Assert $page) => $page
            ->component('IpAddresses/Index')
            ->has('ip_addresses', 0)
    );
});
