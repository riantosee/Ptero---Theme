<?php

declare(strict_types=1);

namespace MiraiSocial\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Pterodactyl\Models\User;
use Symfony\Component\HttpFoundation\Response;

class ApiKeyAuthentication
{
    public function handle(Request $request, Closure $next): Response
    {
        $token = $request->bearerToken();
        abort_unless(is_string($token) && preg_match('/^mso_[A-Za-z0-9]{40,}$/', $token) === 1, 401, 'A valid Mirai Social API key is required.');

        $key = DB::table('ext_mirai_social_api_keys')->where('token_hash', hash('sha256', $token))->whereNull('revoked_at')->first();
        abort_unless($key, 401, 'The Mirai Social API key is invalid or revoked.');
        $user = User::query()->find($key->user_id);
        abort_unless($user, 401, 'The API key owner no longer exists.');

        DB::table('ext_mirai_social_api_keys')->where('id', $key->id)->update(['last_used_at' => now(), 'updated_at' => now()]);
        $request->attributes->set('mirai_social_api_key', $key);
        $request->setUserResolver(static fn () => $user);

        return $next($request);
    }
}
