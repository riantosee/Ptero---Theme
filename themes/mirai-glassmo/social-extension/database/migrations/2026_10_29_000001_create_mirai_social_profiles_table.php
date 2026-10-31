<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ext_mirai_social_profiles', function (Blueprint $table): void {
            $table->unsignedInteger('user_id')->primary();
            $table->string('avatar_path', 255)->nullable();
            $table->timestamp('updated_at')->useCurrent();
            $table->foreign('user_id', 'mirai_social_profile_user_fk')->references('id')->on('users')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ext_mirai_social_profiles');
    }
};
