<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sound_sources', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('type'); // piano, harp, synth_pad, japanese_instrument
            $table->string('category')->default('basic'); // basic, japanese, 80s_synth
            $table->string('file_path')->nullable();
            $table->boolean('is_free')->default(true);
            $table->integer('price')->default(0);
            $table->string('icon_path')->nullable();
            $table->text('description')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sound_sources');
    }
};
