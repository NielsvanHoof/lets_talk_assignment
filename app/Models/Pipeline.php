<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Pipeline extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'cron_expression',
        'is_active',
        'is_scheduled',
        'last_run_at',
        'next_run_at',
        'user_id',
    ];

    protected function casts(): array
    {
        return [
            'last_run_at' => 'datetime',
            'next_run_at' => 'datetime',
            'is_active' => 'boolean',
            'is_scheduled' => 'boolean',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
