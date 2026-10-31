<?php

declare(strict_types=1);

namespace MiraiSocial\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;
use Pterodactyl\Models\Server;
use MiraiSocial\Services\ServerTermService;

class ServerTermController
{
    public function show(Request $request, Server $server): JsonResponse
    {
        $term = DB::table('ext_mirai_social_server_terms')->where('server_id', $server->id)->first();
        return new JsonResponse([
            'server' => ['name' => $server->name, 'identifier' => $server->uuidShort],
            'expires_at' => $term?->expires_at,
            'expired_at' => $term?->expired_at,
            'expired' => $term?->expires_at ? now()->greaterThanOrEqualTo($term->expires_at) : false,
            'server_suspended' => $server->isSuspended(),
            'suspended_by_expiry' => (bool) ($term?->suspended_by_expiry ?? false),
            'can_manage' => $this->canManage($request, $server),
        ]);
    }

    public function set(Request $request, Server $server): JsonResponse
    {
        abort_unless($this->canManage($request, $server), 403, 'Only a root administrator or an authorized reseller who owns this server can manage its term.');
        $values = $request->validate(['duration_days' => ['required', 'integer', 'min:1', 'max:3650']]);
        $expires = now()->addDays((int) $values['duration_days']);
        $this->save($request, $server, $expires);
        app(ServerTermService::class)->processExpirations();
        return $this->show($request, $server);
    }

    public function renew(Request $request, Server $server): JsonResponse
    {
        abort_unless($this->canManage($request, $server), 403, 'Only a root administrator or an authorized reseller who owns this server can manage its term.');
        $values = $request->validate(['duration_days' => ['required', 'integer', 'min:1', 'max:3650']]);
        $term = DB::table('ext_mirai_social_server_terms')->where('server_id', $server->id)->first();
        $base = $term?->expires_at ? Carbon::parse($term->expires_at) : now();
        if ($base->lessThan(now())) $base = now();
        $this->save($request, $server, $base->addDays((int) $values['duration_days']));
        app(ServerTermService::class)->processExpirations();
        return $this->show($request, $server);
    }

    private function save(Request $request, Server $server, $expires): void
    {
        $values = ['expires_at' => $expires, 'expired_at' => null, 'assigned_by' => $request->user()->id, 'updated_at' => now()];
        if (DB::table('ext_mirai_social_server_terms')->where('server_id', $server->id)->exists()) {
            DB::table('ext_mirai_social_server_terms')->where('server_id', $server->id)->update($values);
        } else {
            $values['server_id'] = $server->id;
            $values['suspended_by_expiry'] = false;
            $values['created_at'] = now();
            DB::table('ext_mirai_social_server_terms')->insert($values);
        }
        // Preserve the expiry-owned flag only when the service will need to restore this server.
        if (DB::table('ext_mirai_social_server_terms')->where('server_id', $server->id)->value('suspended_by_expiry')) {
            app(ServerTermService::class)->processExpirations();
        }
    }

    private function canManage(Request $request, Server $server): bool
    {
        $user = $request->user();
        if ((bool) $user->root_admin) return true;
        return (int) $server->owner_id === (int) $user->id
            && DB::table('ext_mirai_social_resellers')->where('user_id', $user->id)->exists();
    }
}
