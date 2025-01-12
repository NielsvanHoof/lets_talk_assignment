<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->admin = User::factory()->create();
    $this->actingAs($this->admin);
});

test('the user index page is accessible', function () {
    $users = User::factory()->count(3)->create();

    $response = $this->get(route('users.index'));

    $response->assertInertia(
        fn (Assert $page) => $page
            ->component('Users/Index')
            ->has('users', 4)
            ->has(
                'users.0',
                fn (Assert $page) => $page
                    ->has('id')
                    ->has('name')
                    ->has('email')
                    ->has('email_verified_at')
                    ->has('created_at')
                    ->has('updated_at')
            )
    );
});

test('a user can be created', function () {
    $data = [
        'name' => 'John Doe',
        'email' => 'test@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ];

    $response = $this->post(route('users.store'), $data);

    $response->assertRedirect();
    $response->assertSessionHas([
        'status' => 'success',
        'message' => 'User created successfully',
    ]);

    $this->assertDatabaseHas('users', [
        'name' => $data['name'],
        'email' => $data['email'],
    ]);

    $response = $this->get(route('users.index'));
    $response->assertInertia(
        fn (Assert $page) => $page
            ->component('Users/Index')
            ->has('users', 2)
            ->where(
                'users',
                fn ($users) => collect($users)->contains(
                    fn ($user) => $user['name'] === $data['name']
                    && $user['email'] === $data['email']
                    && isset($user['id'])
                    && isset($user['created_at'])
                    && isset($user['updated_at'])
                )
            )
    );
});

test('invalid user data is rejected', function () {
    $data = [
        'name' => '',
        'email' => 'not-an-email',
        'password' => 'short',
    ];

    $response = $this->post(route('users.store'), $data);

    $response->assertSessionHasErrors(['name', 'email', 'password']);
    $this->assertDatabaseMissing('users', [
        'email' => $data['email'],
    ]);
});

test('a user can be deleted', function () {
    $user = User::factory()->create();

    $response = $this->delete(route('users.destroy', $user));

    $response->assertRedirect();
    $response->assertSessionHas([
        'status' => 'success',
        'message' => 'User deleted successfully',
    ]);

    $this->assertDatabaseMissing('users', [
        'id' => $user->id,
    ]);

    $response = $this->get(route('users.index'));
    $response->assertInertia(
        fn (Assert $page) => $page
            ->component('Users/Index')
            ->has('users', 1)
            ->where(
                'users',
                fn ($users) => collect($users)->every(
                    fn ($u) => $u['id'] !== $user->id
                )
            )
    );
});

test('a user cannot delete himself', function () {
    $response = $this->delete(route('users.destroy', $this->admin));
    $response->assertRedirect();

    $response->assertSessionHas([
        'status' => 'error',
        'message' => 'You cannot delete your own account',
    ]);

    $this->assertDatabaseHas('users', [
        'id' => $this->admin->id,
    ]);

    $response = $this->get(route('users.index'));
    $response->assertInertia(
        fn (Assert $page) => $page
            ->component('Users/Index')
            ->has('users', 1)
            ->where(
                'users',
                fn ($users) => collect($users)->contains(
                    fn ($u) => $u['id'] === $this->admin->id
                )
            )
    );
});
