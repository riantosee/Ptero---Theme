<?php

declare(strict_types=1);

namespace MiraiSocial;

use Pterodactyl\Extensions\ExtensionProvider;
use Pterodactyl\Services\Extensions\ExtensionSettingDefinition;
use Pterodactyl\Services\Extensions\ExtensionSettingsDefinition;

class MiraiSocialProvider extends ExtensionProvider
{
    public function register(): void
    {
        $this->registerSettings(new ExtensionSettingsDefinition($this->settings(), [
            ExtensionSettingDefinition::make('ai_enabled', 'ai_enabled', false, ['boolean'])
                ->label('Enable AI assistant')
                ->help('Turns the AI assistant on for signed-in panel users.')
                ->field('toggle'),
            ExtensionSettingDefinition::make('ai_model', 'ai_model', 'gpt-4.1-mini', ['required', 'string', 'max:100'])
                ->label('AI model ID')
                ->help('Enter the exact model name supported by your provider.')
                ->field('text'),
            ExtensionSettingDefinition::make('ai_endpoint', 'ai_endpoint', 'https://api.openai.com/v1/responses', ['required', 'string', 'max:500'])
                ->label('AI API endpoint')
                ->help('Full HTTPS endpoint URL. Public HTTPS hosts only; redirects and private network destinations are blocked.')
                ->field('text'),
            ExtensionSettingDefinition::make('ai_format', 'ai_format', 'responses', ['required', 'in:responses,chat_completions'])
                ->label('AI API format')
                ->help('Choose the request format supported by the endpoint URL.')
                ->field('select', [
                    ['value' => 'responses', 'label' => 'Responses API'],
                    ['value' => 'chat_completions', 'label' => 'Chat Completions API'],
                ]),
            ExtensionSettingDefinition::make('ai_api_key', 'ai_api_key', null, ['nullable', 'string', 'max:500'])
                ->label('Provider API key')
                ->help('Stored encrypted by the panel and never sent to browsers. Set a provider-side usage limit.')
                ->field('password'),
            ExtensionSettingDefinition::make('ai_instructions', 'ai_instructions', 'You are Mirai, a helpful assistant inside a Pterodactyl server panel. Always answer in English. Be clear, concise, and practical. Never claim you can control servers or see private panel data.', ['required', 'string', 'max:4000'])
                ->label('AI instructions')
                ->help('System instructions sent to the AI for each request.')
                ->textarea(4000),
        ]));
    }

    public function boot(): void
    {
        $this->registerClientApiRoutes($this->extensionPath('routes', 'client.php'));
        $this->registerServerApiRoutes($this->extensionPath('routes', 'server.php'));
        $this->registerAdminApiRoutes($this->extensionPath('routes', 'admin.php'));

        \Illuminate\Support\Facades\Route::prefix('api/extensions/mirai-social/v1')
            ->middleware(['api', 'throttle:60,1', \MiraiSocial\Http\Middleware\ApiKeyAuthentication::class])
            ->name('mirai-social.token-api.')
            ->group(function (): void {
                \Illuminate\Support\Facades\Route::get('/servers/{server}/term', [\MiraiSocial\Http\Controllers\ServerTermController::class, 'show'])
                    ->whereNumber('server')->middleware(\MiraiSocial\Http\Middleware\ApiKeyScope::class.':server-terms:read')->name('terms.show');
                \Illuminate\Support\Facades\Route::put('/servers/{server}/term', [\MiraiSocial\Http\Controllers\ServerTermController::class, 'set'])
                    ->whereNumber('server')->middleware(\MiraiSocial\Http\Middleware\ApiKeyScope::class.':server-terms:write')->name('terms.set');
                \Illuminate\Support\Facades\Route::post('/servers/{server}/term/renew', [\MiraiSocial\Http\Controllers\ServerTermController::class, 'renew'])
                    ->whereNumber('server')->middleware(\MiraiSocial\Http\Middleware\ApiKeyScope::class.':server-terms:renew')->name('terms.renew');
                \Illuminate\Support\Facades\Route::get('/broadcasts', [\MiraiSocial\Http\Controllers\BroadcastController::class, 'index'])
                    ->middleware(\MiraiSocial\Http\Middleware\ApiKeyScope::class.':broadcasts:read')->name('broadcasts.index');
                \Illuminate\Support\Facades\Route::post('/broadcasts', [\MiraiSocial\Http\Controllers\BroadcastController::class, 'create'])
                    ->middleware(\MiraiSocial\Http\Middleware\ApiKeyScope::class.':broadcasts:write')->name('broadcasts.create');
                \Illuminate\Support\Facades\Route::delete('/broadcasts/{broadcast}', [\MiraiSocial\Http\Controllers\BroadcastController::class, 'delete'])
                    ->whereNumber('broadcast')->middleware(\MiraiSocial\Http\Middleware\ApiKeyScope::class.':broadcasts:write')->name('broadcasts.delete');
            });

        \Illuminate\Support\Facades\Schedule::call(function (): void {
            app(\MiraiSocial\Services\ServerTermService::class)->processExpirations();
        })->everyMinute()->name('mirai-social.server-expiry')->withoutOverlapping();
    }
}
