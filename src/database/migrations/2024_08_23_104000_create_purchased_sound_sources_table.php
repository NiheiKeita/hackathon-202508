<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('purchased_sound_sources', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('sound_source_id')->constrained()->onDelete('cascade');
            $table->string('qr_code')->nullable();
            $table->timestamp('purchased_at');
            $table->timestamps();

            // 重複購入を防ぐ
            $table->unique(['user_id', 'sound_source_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('purchased_sound_sources');
    }
};
