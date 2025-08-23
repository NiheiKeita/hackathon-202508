<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sound_seeds', function (Blueprint $table) {
            $table->id();
            $table->foreignId('park_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('sound_source_id')->constrained()->onDelete('cascade');
            $table->integer('x_position');
            $table->integer('y_position');
            $table->integer('volume')->default(70); // 0-100
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sound_seeds');
    }
};