<?php

use Illuminate\Support\Facades\Route;
use MiraiSocial\Http\Controllers\AiController;
use MiraiSocial\Http\Controllers\ConversationController;
use MiraiSocial\Http\Controllers\ProfileController;
use MiraiSocial\Http\Controllers\BroadcastController;

Route::get('/profile', [ProfileController::class, 'show'])->name('profile.show');
Route::post('/profile/avatar', [ProfileController::class, 'upload'])->middleware('throttle:10,1')->name('profile.avatar.upload');
Route::delete('/profile/avatar', [ProfileController::class, 'remove'])->name('profile.avatar.remove');
Route::get('/avatar/{user}', [ProfileController::class, 'avatar'])->whereNumber('user')->name('profile.avatar');
Route::get('/inbox', [ConversationController::class, 'inbox'])->name('inbox');
Route::get('/messages/{peer}', [ConversationController::class, 'messages'])->whereNumber('peer')->name('messages');
Route::post('/messages', [ConversationController::class, 'send'])->middleware('throttle:30,1')->name('messages.send');
Route::post('/ai', [AiController::class, 'respond'])->middleware('throttle:6,1')->name('ai.respond');
Route::get('/broadcasts', [BroadcastController::class, 'index'])->name('broadcasts.index');
Route::post('/broadcasts/{broadcast}/read', [BroadcastController::class, 'markRead'])->whereNumber('broadcast')->name('broadcasts.read');
