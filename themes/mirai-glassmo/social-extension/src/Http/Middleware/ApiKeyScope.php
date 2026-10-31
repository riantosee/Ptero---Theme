<?php

declare(strict_types=1);

namespace MiraiSocial\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ApiKeyScope
{
    public function handle(Request $request, Closure $next, string $scope): Response
    {
        $key = $request->attributes->get('mirai_social_api_key');
        abort_unless($key, 401, 'A Mirai Social API key is required.');
        $scopes = json_decode((string) $key->scopes, true);
        abort_unless(is_array($scopes) && in_array($scope, $scopes, true), 403, 'This API key does not have the required scope.');

        return $next($request);
    }
}
