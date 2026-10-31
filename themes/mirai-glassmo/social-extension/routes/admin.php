<?php

use Illuminate\Support\Facades\Route;
use MiraiSocial\Http\Controllers\BroadcastController;
use MiraiSocial\Http\Controllers\ApiKeyAdminController;

Route::get('/resellers-broadcasts', [BroadcastController::class, 'adminIndex'])->name('admin.index');
Route::post('/resellers', [BroadcastController::class, 'grantReseller'])->middleware('throttle:20,1')->name('resellers.grant');
Route::delete('/resellers/{user}', [BroadcastController::class, 'revokeReseller'])->whereNumber('user')->name('resellers.revoke');
Route::post('/broadcasts', [BroadcastController::class, 'create'])->middleware('throttle:10,1')->name('broadcasts.create');
Route::delete('/broadcasts/{broadcast}', [BroadcastController::class, 'delete'])->whereNumber('broadcast')->name('broadcasts.delete');
Route::get('/api-keys', [ApiKeyAdminController::class, 'index'])->name('api-keys.index');
Route::post('/api-keys', [ApiKeyAdminController::class, 'create'])->middleware('throttle:10,1')->name('api-keys.create');
Route::delete('/api-keys/{key}', [ApiKeyAdminController::class, 'revoke'])->whereNumber('key')->name('api-keys.revoke');
