<?php

namespace App\Http\Controllers;

use App\Models\AllowedIpAddresses;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class IpAddressController extends Controller
{
    public function index()
    {
        return Inertia::render('IpAddresses/Index', [
            'ip_addresses' => AllowedIpAddresses::query()
                ->orderBy('created_at', 'desc')
                ->get(),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'ip_address' => ['required', 'ip'],
            'description' => ['required', 'string', 'max:255'],
        ]);

        AllowedIpAddresses::create($data);

        return Redirect::back()->with([
            'status' => 'success',
            'message' => 'IP address added successfully',
        ]);
    }

    public function destroy(AllowedIpAddresses $ipAddress)
    {
        $ipAddress->delete();

        return Redirect::back()->with([
            'status' => 'success',
            'message' => 'IP address removed successfully',
        ]);
    }
}
