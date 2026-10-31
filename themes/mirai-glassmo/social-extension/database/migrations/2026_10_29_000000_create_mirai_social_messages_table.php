<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ext_mirai_social_messages', function (Blueprint $table): void {
            $table->bigIncrements('id');
            $table->unsignedInteger('sender_id');
            $table->unsignedInteger('recipient_id');
            $table->text('body');
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('read_at')->nullable();
            $table->index(['recipient_id', 'read_at', 'id'], 'mirai_social_unread_idx');
            $table->index(['sender_id', 'recipient_id', 'id'], 'mirai_social_pair_a_idx');
            $table->index(['recipient_id', 'sender_id', 'id'], 'mirai_social_pair_b_idx');
            $table->foreign('sender_id', 'mirai_social_sender_fk')->references('id')->on('users')->cascadeOnDelete();
            $table->foreign('recipient_id', 'mirai_social_recipient_fk')->references('id')->on('users')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ext_mirai_social_messages');
    }
};
