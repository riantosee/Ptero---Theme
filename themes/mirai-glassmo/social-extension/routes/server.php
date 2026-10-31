<?php

use Illuminate\Support\Facades\Route;
use MiraiSocial\Http\Controllers\ServerTermController;

Route::get('/term', [ServerTermController::class, 'show'])->name('term.show');
Route::put('/term', [ServerTermController::class, 'set'])->middleware('throttle:20,1')->name('term.set');
Route::post('/term/renew', [ServerTermController::class, 'renew'])->middleware('throttle:20,1')->name('term.renew');
