<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Storage;

class SoundSource extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'type',
        'category',
        'file_path',
        'is_free',
        'price',
        'icon_path',
        'description',
    ];

    protected $casts = [
        'is_free' => 'boolean',
        'price' => 'integer',
    ];

    public function soundSeeds(): HasMany
    {
        return $this->hasMany(SoundSeed::class);
    }

    public function qrCodes(): HasMany
    {
        return $this->hasMany(QrCode::class);
    }

    public function purchasedSoundSources(): HasMany
    {
        return $this->hasMany(PurchasedSoundSource::class);
    }

    public function getFileUrlAttribute(): ?string
    {
        return $this->file_path ? Storage::disk('public')->url($this->file_path) : null;
    }

    public function getIconUrlAttribute(): ?string
    {
        return $this->icon_path ? Storage::disk('public')->url($this->icon_path) : null;
    }
}
