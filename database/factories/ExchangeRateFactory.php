<?php

namespace Database\Factories;

use App\Models\ExchangeRate;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;

class ExchangeRateFactory extends Factory
{
    protected $model = ExchangeRate::class;

    public function definition(): array
    {
        return [
            'code' => $this->faker->word(),
            'alphaCode' => $this->faker->word(),
            'name' => $this->faker->name(),
            'rate' => $this->faker->randomFloat(),
            'date' => $this->faker->word(),
            'inverseRate' => $this->faker->randomFloat(),
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ];
    }
}
