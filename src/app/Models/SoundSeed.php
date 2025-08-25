<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SoundSeed extends Model
{
    use HasFactory;

    protected $fillable = [
        'park_id',
        'user_id',
        'sound_source_id',
        'x_position',
        'y_position',
        'volume',
    ];

    protected $casts = [
        'x_position' => 'integer',
        'y_position' => 'integer',
        'volume' => 'integer',
    ];

    public function park(): BelongsTo
    {
        return $this->belongsTo(Park::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function soundSource(): BelongsTo
    {
        return $this->belongsTo(SoundSource::class);
    }
}
