<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ext_mirai_social_api_keys', function (Blueprint $table): void {
            $table->bigIncrements('id');
            $table->unsignedInteger('user_id');
            $table->unsignedInteger('created_by');
            $table->string('name', 80);
            $table->string('key_prefix', 16)->index();
            $table->char('token_hash', 64)->unique();
            $table->json('scopes');
            $table->timestamp('last_used_at')->nullable();
            $table->timestamp('revoked_at')->nullable()->index();
            $table->timestamps();
            $table->foreign('user_id', 'ms_api_key_user_fk')->references('id')->on('users')->cascadeOnDelete();
            $table->foreign('created_by', 'ms_api_key_creator_fk')->references('id')->on('users')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ext_mirai_social_api_keys');
    }
};
