<?php

declare(strict_types=1);

namespace MiraiSocial\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class BroadcastController
{
    public function index(Request $request): JsonResponse
    {
        $userId = (int) $request->user()->id;
        $items = DB::table('ext_mirai_social_broadcasts as b')
            ->leftJoin('ext_mirai_social_broadcast_reads as r', function ($join) use ($userId): void { $join->on('r.broadcast_id', '=', 'b.id')->where('r.user_id', '=', $userId); })
            ->where(fn ($query) => $query->whereNull('b.expires_at')->orWhere('b.expires_at', '>', now()))
            ->orderByDesc('b.published_at')->limit(50)
            ->get(['b.id', 'b.title', 'b.body', 'b.published_at', 'b.expires_at', 'r.read_at']);
        return new JsonResponse(['broadcasts' => $items]);
    }

    public function markRead(Request $request, int $broadcast): JsonResponse
    {
        $exists = DB::table('ext_mirai_social_broadcasts')->where('id', $broadcast)->exists();
        abort_unless($exists, 404);
        DB::table('ext_mirai_social_broadcast_reads')->updateOrInsert(['broadcast_id' => $broadcast, 'user_id' => $request->user()->id], ['read_at' => now()]);
        return new JsonResponse(['ok' => true]);
    }

    public function adminIndex(Request $request): JsonResponse
    {
        $this->admin($request);
        return new JsonResponse([
            'broadcasts' => DB::table('ext_mirai_social_broadcasts')->orderByDesc('published_at')->limit(100)->get(),
            'resellers' => DB::table('ext_mirai_social_resellers as r')->join('users as u', 'u.id', '=', 'r.user_id')->orderBy('u.username')->get(['u.id', 'u.username', 'u.name_first', 'u.name_last', 'r.created_at']),
        ]);
    }

    public function create(Request $request): JsonResponse
    {
        $this->admin($request);
        $data = $request->validate(['title' => ['required', 'string', 'max:120'], 'body' => ['required', 'string', 'max:10000'], 'expires_at' => ['nullable', 'date', 'after:now']]);
        $id = DB::table('ext_mirai_social_broadcasts')->insertGetId([
            'title' => trim(strip_tags($data['title'])), 'body' => trim(strip_tags($data['body'])),
            'created_by' => $request->user()->id, 'published_at' => now(), 'expires_at' => $data['expires_at'] ?? null,
            'created_at' => now(), 'updated_at' => now(),
        ]);
        return new JsonResponse(['broadcast' => DB::table('ext_mirai_social_broadcasts')->where('id', $id)->first()], 201);
    }

    public function delete(Request $request, int $broadcast): JsonResponse
    {
        $this->admin($request);
        DB::table('ext_mirai_social_broadcasts')->where('id', $broadcast)->delete();
        return new JsonResponse(['ok' => true]);
    }

    public function grantReseller(Request $request): JsonResponse
    {
        $this->admin($request);
        $data = $request->validate(['username' => ['required', 'string', 'max:191', 'exists:users,username']]);
        $user = DB::table('users')->where('username', $data['username'])->first();
        abort_if((bool) $user->root_admin, 422, 'Root administrators do not need reseller access.');
        DB::table('ext_mirai_social_resellers')->updateOrInsert(['user_id' => $user->id], ['granted_by' => $request->user()->id, 'created_at' => now(), 'updated_at' => now()]);
        return $this->adminIndex($request);
    }

    public function revokeReseller(Request $request, int $user): JsonResponse
    {
        $this->admin($request);
        DB::table('ext_mirai_social_resellers')->where('user_id', $user)->delete();
        return $this->adminIndex($request);
    }

    private function admin(Request $request): void { abort_unless((bool) $request->user()->root_admin, 403); }
}
