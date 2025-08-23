<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('weather_data', function (Blueprint $table) {
            $table->id();
            $table->foreignId('park_id')->constrained()->onDelete('cascade');
            $table->decimal('temperature', 5, 2);
            $table->integer('humidity'); // 0-100%
            $table->decimal('wind_speed', 5, 2); // m/s
            $table->decimal('rain_level', 5, 2)->default(0); // mm/h
            $table->boolean('thunder')->default(false);
            $table->string('weather_condition')->default('clear'); // clear, cloudy, rainy, stormy
            $table->timestamp('recorded_at');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('weather_data');
    }
};