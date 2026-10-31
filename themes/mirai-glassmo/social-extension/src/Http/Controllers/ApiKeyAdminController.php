<?php

declare(strict_types=1);

namespace MiraiSocial\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Pterodactyl\Models\User;

class ApiKeyAdminController
{
    private const SCOPES = ['server-terms:read', 'server-terms:write', 'server-terms:renew', 'broadcasts:read', 'broadcasts:write'];

    public function index(Request $request): JsonResponse
    {
        $this->authorizeRoot($request);
        return new JsonResponse(['keys' => DB::table('ext_mirai_social_api_keys as k')
            ->join('users as owner', 'owner.id', '=', 'k.user_id')
            ->leftJoin('users as creator', 'creator.id', '=', 'k.created_by')
            ->whereNull('k.revoked_at')->orderByDesc('k.id')->limit(100)
            ->get(['k.id', 'k.name', 'k.key_prefix', 'k.scopes', 'k.last_used_at', 'k.created_at', 'owner.username as owner_username', 'creator.username as created_by_username'])]);
    }

    public function create(Request $request): JsonResponse
    {
        $this->authorizeRoot($request);
        $values = $request->validate([
            'name' => ['required', 'string', 'max:80'],
            'username' => ['required', 'string', 'max:191', 'exists:users,username'],
            'scopes' => ['required', 'array', 'min:1', 'max:5'],
            'scopes.*' => ['required', 'string', 'distinct', 'in:'.implode(',', self::SCOPES)],
        ]);

        $owner = User::query()->where('username', $values['username'])->firstOrFail();
        abort_unless((bool) $owner->root_admin || DB::table('ext_mirai_social_resellers')->where('user_id', $owner->id)->exists(), 422, 'API keys can only be issued to a root administrator or an authorized reseller.');
        if (! $owner->root_admin) {
            abort_if(array_intersect($values['scopes'], ['broadcasts:write']) !== [], 422, 'Reseller API keys cannot publish or delete global announcements.');
        }

        $secret = 'mso_'.bin2hex(random_bytes(24));
        $prefix = substr($secret, 0, 12);
        $id = DB::table('ext_mirai_social_api_keys')->insertGetId([
            'user_id' => $owner->id, 'created_by' => $request->user()->id, 'name' => trim(strip_tags($values['name'])),
            'key_prefix' => $prefix, 'token_hash' => hash('sha256', $secret), 'scopes' => json_encode(array_values(array_unique($values['scopes'])), JSON_THROW_ON_ERROR),
            'created_at' => now(), 'updated_at' => now(),
        ]);

        return new JsonResponse(['key' => ['id' => $id, 'name' => trim(strip_tags($values['name'])), 'owner_username' => $owner->username, 'key_prefix' => $prefix, 'scopes' => array_values(array_unique($values['scopes']))], 'secret' => $secret], 201);
    }

    public function revoke(Request $request, int $key): JsonResponse
    {
        $this->authorizeRoot($request);
        DB::table('ext_mirai_social_api_keys')->where('id', $key)->whereNull('revoked_at')->update(['revoked_at' => now(), 'updated_at' => now()]);
        return $this->index($request);
    }

    private function authorizeRoot(Request $request): void { abort_unless((bool) $request->user()->root_admin, 403); }
}
