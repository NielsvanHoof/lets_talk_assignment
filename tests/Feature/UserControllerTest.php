<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('the user index page is accessible', function () {
    $response = $this->get(route('users.index'));

    $response->assertOk();
});

test('a user can be created', function () {
    $response = $this->post(route('users.store'), [
        'name' => 'John Doe',
        'email' => 'test@example.com',
        'password' => Hash::make('password'),
    ]);

    $response->assertRedirect();

    $response->assertSessionHas('status', 'success');
    $response->assertSessionHas('message', 'User created successfully');

    $this->assertDatabaseHas('users', [
        'name' => 'John Doe',
        'email' => 'test@example.com',
    ]);
});

test('a user can be deleted', function () {
    $user = User::factory()->create();

    $response = $this->delete(route('users.destroy', $user));

    $response->assertRedirect();

    $response->assertSessionHas('status', 'success');
    $response->assertSessionHas('message', 'User deleted successfully');

    $this->assertDatabaseMissing('users', [
        'id' => $user->id,
    ]);
});


test('a user cannot delete himself', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)
        ->delete(route('users.destroy', $user));

    $response->assertForbidden();

    $response->assertSessionHas('status', 'error');
    $response->assertSessionHas('message', 'You cannot delete your own account');

    $this->assertDatabaseHas('users', [
        'id' => $user->id,
    ]);
});
