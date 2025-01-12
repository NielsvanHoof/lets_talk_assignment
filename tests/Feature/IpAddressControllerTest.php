<?php

use App\Models\AllowedIpAddresses;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('the ip address index page is accessible', function () {
    $response = $this->get(route('ip-addresses.index'));

    $response->assertOk();
});

test('an IP address can be added', function () {
    $data = [
        'ip_address' => '192.168.1.10',
        'description' => 'Test IP Address',
    ];

    $response = $this->post(route('ip-addresses.store'), $data);

    $response->assertRedirect();

    $response->assertSessionHas('status', 'success');
    $response->assertSessionHas('message', 'IP address added successfully');

    $this->assertDatabaseHas('allowed_ip_addresses', $data);

});

test('an IP address can be removed', function () {
    $ipAddress = AllowedIpAddresses::factory()->create();

    $response = $this->delete(route('ip-addresses.destroy', $ipAddress));

    $response->assertRedirect();

    $response->assertSessionHas('status', 'success');
    $response->assertSessionHas('message', 'IP address removed successfully');

    $this->assertDatabaseMissing('allowed_ip_addresses', [
        'id' => $ipAddress->id,
    ]);
});
