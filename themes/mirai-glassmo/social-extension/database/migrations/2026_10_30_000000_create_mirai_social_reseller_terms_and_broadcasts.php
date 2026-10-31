<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ext_mirai_social_resellers', function (Blueprint $table): void {
            $table->unsignedInteger('user_id')->primary();
            $table->unsignedInteger('granted_by')->nullable();
            $table->timestamps();
            $table->foreign('user_id', 'ms_reseller_user_fk')->references('id')->on('users')->cascadeOnDelete();
            $table->foreign('granted_by', 'ms_reseller_grantor_fk')->references('id')->on('users')->nullOnDelete();
        });

        Schema::create('ext_mirai_social_server_terms', function (Blueprint $table): void {
            $table->unsignedInteger('server_id')->primary();
            $table->timestamp('expires_at')->nullable()->index();
            $table->timestamp('expired_at')->nullable();
            $table->boolean('suspended_by_expiry')->default(false);
            $table->unsignedInteger('assigned_by')->nullable();
            $table->timestamps();
            $table->foreign('server_id', 'ms_term_server_fk')->references('id')->on('servers')->cascadeOnDelete();
            $table->foreign('assigned_by', 'ms_term_assigner_fk')->references('id')->on('users')->nullOnDelete();
        });

        Schema::create('ext_mirai_social_broadcasts', function (Blueprint $table): void {
            $table->bigIncrements('id');
            $table->string('title', 120);
            $table->text('body');
            $table->unsignedInteger('created_by');
            $table->timestamp('published_at')->useCurrent();
            $table->timestamp('expires_at')->nullable()->index();
            $table->timestamps();
            $table->foreign('created_by', 'ms_broadcast_creator_fk')->references('id')->on('users')->cascadeOnDelete();
        });

        Schema::create('ext_mirai_social_broadcast_reads', function (Blueprint $table): void {
            $table->unsignedBigInteger('broadcast_id');
            $table->unsignedInteger('user_id');
            $table->timestamp('read_at')->useCurrent();
            $table->primary(['broadcast_id', 'user_id'], 'ms_broadcast_read_pk');
            $table->foreign('broadcast_id', 'ms_broadcast_read_message_fk')->references('id')->on('ext_mirai_social_broadcasts')->cascadeOnDelete();
            $table->foreign('user_id', 'ms_broadcast_read_user_fk')->references('id')->on('users')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ext_mirai_social_broadcast_reads');
        Schema::dropIfExists('ext_mirai_social_broadcasts');
        Schema::dropIfExists('ext_mirai_social_server_terms');
        Schema::dropIfExists('ext_mirai_social_resellers');
    }
};
