<?php

namespace App\Http\Middleware;

use App\Models\AllowedIpAddresses;
use Auth;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureIpIsAllowed
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (Auth::check()) {
            $ipAddress = $request->ip();
            $allowedIpAddresses = AllowedIpAddresses::query()->where('is_active', true)->get();

            if (! $allowedIpAddresses->contains('ip_address', $ipAddress)) {
                abort(403);
            }
        }

        return $next($request);
    }
}
