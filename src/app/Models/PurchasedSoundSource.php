<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PurchasedSoundSource extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'sound_source_id',
        'qr_code',
        'purchased_at',
    ];

    protected $casts = [
        'purchased_at' => 'timestamp',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function soundSource(): BelongsTo
    {
        return $this->belongsTo(SoundSource::class);
    }
}
