<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {
        return Inertia::render('Users/Index', [
            'users' => User::query()
                ->orderBy('created_at', 'desc')
                ->get(),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'confirmed', Password::defaults()],
        ]);

        User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
        ]);

        return Redirect::back()->with([
            'status' => 'success',
            'message' => 'User created successfully',
        ]);
    }

    public function destroy(User $user)
    {
        if ($user->id === auth()->id()) {
            return Redirect::back()->with([
                'status' => 'error',
                'message' => 'You cannot delete your own account',
            ]);
        }

        $user->delete();

        return Redirect::back()->with([
            'status' => 'success',
            'message' => 'User deleted successfully',
        ]);
    }
}
