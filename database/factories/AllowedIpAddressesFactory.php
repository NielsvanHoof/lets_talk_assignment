<?php

namespace Database\Factories;

use App\Models\AllowedIpAddresses;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;

class AllowedIpAddressesFactory extends Factory
{
    protected $model = AllowedIpAddresses::class;

    public function definition(): array
    {
        return [
            'ip_address' => $this->faker->ipv4(),
            'description' => $this->faker->text(),
            'is_active' => $this->faker->boolean(),
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),

            'user_id' => User::factory(),
        ];
    }
}
