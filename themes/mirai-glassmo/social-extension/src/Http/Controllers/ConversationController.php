<?php

declare(strict_types=1);

namespace MiraiSocial\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Pterodactyl\Models\User;

class ConversationController
{
    public function inbox(Request $request): JsonResponse
    {
        $self = (int) $request->user()->id;
        $users = User::query()
            ->where('id', '!=', $self)
            ->leftJoin('ext_mirai_social_profiles as social_profiles', 'social_profiles.user_id', '=', 'users.id')
            ->orderBy('username')
            ->limit(200)
            ->get(['users.id', 'username', 'name_first', 'name_last', 'root_admin', 'social_profiles.updated_at as avatar_updated_at']);

        $rows = DB::table('ext_mirai_social_messages')
            ->where(fn ($query) => $query->where('sender_id', $self)->orWhere('recipient_id', $self))
            ->orderByDesc('id')
            ->limit(5000)
            ->get();

        $latest = [];
        $unread = [];
        foreach ($rows as $row) {
            $sender = (int) $row->sender_id;
            $recipient = (int) $row->recipient_id;
            $peer = $sender === $self ? $recipient : $sender;
            if (! isset($latest[$peer])) {
                $latest[$peer] = [
                    'id' => (int) $row->id,
                    'body' => $row->body,
                    'created_at' => $row->created_at,
                    'from_me' => $sender === $self,
                ];
            }
            if ($sender === $peer && $recipient === $self && $row->read_at === null) {
                $unread[$peer] = ($unread[$peer] ?? 0) + 1;
            }
        }

        return new JsonResponse([
            'users' => $users->map(fn (User $user) => $this->publicUser($user, $latest[(int) $user->id] ?? null, $unread[(int) $user->id] ?? 0))->values(),
            'unread_total' => array_sum($unread),
            'ai_enabled' => (bool) \Pterodactyl\Facades\Extensions::settings('mirai-social')->get('ai_enabled', false),
            'is_admin' => (bool) $request->user()->root_admin,
            'is_reseller' => DB::table('ext_mirai_social_resellers')->where('user_id', $self)->exists(),
        ]);
    }

    public function messages(Request $request, int $peer): JsonResponse
    {
        $self = (int) $request->user()->id;
        abort_if($peer === $self, 422, 'Choose another panel user.');
        abort_unless(User::query()->whereKey($peer)->exists(), 404);

        DB::table('ext_mirai_social_messages')
            ->where('sender_id', $peer)
            ->where('recipient_id', $self)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        $messages = DB::table('ext_mirai_social_messages')
            ->where(fn ($query) => $query->where(fn ($pair) => $pair->where('sender_id', $self)->where('recipient_id', $peer))
                ->orWhere(fn ($pair) => $pair->where('sender_id', $peer)->where('recipient_id', $self)))
            ->orderByDesc('id')
            ->limit(100)
            ->get()
            ->reverse()
            ->values();

        return new JsonResponse(['messages' => $messages]);
    }

    public function send(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'recipient_id' => ['required', 'integer'],
            'body' => ['required', 'string', 'max:2000'],
        ]);

        $self = (int) $request->user()->id;
        $recipient = (int) $validated['recipient_id'];
        abort_if($recipient === $self, 422, 'You cannot message yourself.');
        abort_unless(User::query()->whereKey($recipient)->exists(), 404);

        $body = trim(strip_tags((string) $validated['body']));
        abort_if($body === '', 422, 'Message cannot be empty.');

        $id = DB::table('ext_mirai_social_messages')->insertGetId([
            'sender_id' => $self,
            'recipient_id' => $recipient,
            'body' => $body,
            'created_at' => now(),
            'read_at' => null,
        ]);

        return new JsonResponse(['message' => DB::table('ext_mirai_social_messages')->where('id', $id)->first()], 201);
    }

    private function publicUser(User $user, ?array $last, int $unread): array
    {
        return [
            'id' => (int) $user->id,
            'username' => $user->username,
            'name' => trim($user->name_first.' '.$user->name_last),
            'is_admin' => (bool) $user->root_admin,
            'avatar_url' => $user->avatar_updated_at
                ? '/api/client/extensions/mirai-social/avatar/'.$user->id.'?v='.rawurlencode((string) $user->avatar_updated_at)
                : null,
            'last_message' => $last,
            'unread' => $unread,
        ];
    }
}
