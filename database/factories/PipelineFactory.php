<?php

namespace Database\Factories;

use App\Models\Pipeline;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;

class PipelineFactory extends Factory
{
    protected $model = Pipeline::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->name(),
            'cron_expression' => $this->faker->word(),
            'is_active' => $this->faker->boolean(),
            'is_scheduled' => $this->faker->boolean(),
            'last_run_at' => Carbon::now(),
            'next_run_at' => Carbon::now(),
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),

            'user_id' => User::factory(),
        ];
    }
}
