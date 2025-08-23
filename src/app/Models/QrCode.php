<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class QrCode extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'sound_source_id',
        'is_active',
        'max_uses',
        'used_count',
        'expires_at',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'max_uses' => 'integer',
        'used_count' => 'integer',
        'expires_at' => 'timestamp',
    ];

    public function soundSource(): BelongsTo
    {
        return $this->belongsTo(SoundSource::class);
    }

    public function canBeUsed(): bool
    {
        if (!$this->is_active) {
            return false;
        }

        if ($this->expires_at && $this->expires_at->isPast()) {
            return false;
        }

        if ($this->max_uses && $this->used_count >= $this->max_uses) {
            return false;
        }

        return true;
    }

    public function incrementUsage(): void
    {
        $this->increment('used_count');
    }
}