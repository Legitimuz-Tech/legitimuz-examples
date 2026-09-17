<?php

use App\Http\Controllers\VerificacaoController;
use App\Http\Controllers\WebhookController;
use Illuminate\Support\Facades\Route;

Route::post('/api/verificacoes', [VerificacaoController::class, 'store'])->middleware('auth');

// Fora do grupo `web`: o CSRF do Laravel recusaria o POST da Legitimuz, que não tem sessão.
Route::post('/api/webhooks/legitimuz', WebhookController::class)
    ->withoutMiddleware([\App\Http\Middleware\VerifyCsrfToken::class]);
