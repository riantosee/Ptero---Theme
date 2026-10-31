<?php

declare(strict_types=1);

namespace MiraiSocial\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Pterodactyl\Models\User;
use Symfony\Component\HttpFoundation\Response;

class ProfileController
{
    public function show(Request $request): JsonResponse
    {
        $userId = (int) $request->user()->id;
        $profile = DB::table('ext_mirai_social_profiles')->where('user_id', $userId)->first();

        return new JsonResponse(['profile' => [
            'avatar_url' => $profile?->avatar_path ? $this->avatarUrl($userId, (string) $profile->updated_at) : null,
        ]]);
    }

    public function upload(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'avatar' => ['required', 'file', 'image', 'mimes:jpeg,png,webp', 'max:2048', 'dimensions:max_width=2048,max_height=2048'],
        ]);

        $userId = (int) $request->user()->id;
        $file = $validated['avatar'];
        $extension = match ($file->getMimeType()) {
            'image/jpeg' => 'jpg',
            'image/png' => 'png',
            'image/webp' => 'webp',
            default => abort(422, 'Choose a JPEG, PNG, or WebP image.'),
        };
        $path = $file->storeAs('mirai-social/avatars', $userId.'-'.Str::uuid().'.'.$extension, 'local');
        abort_unless(is_string($path), 500, 'The profile image could not be saved.');

        $previous = DB::table('ext_mirai_social_profiles')->where('user_id', $userId)->value('avatar_path');
        DB::table('ext_mirai_social_profiles')->updateOrInsert(
            ['user_id' => $userId],
            ['avatar_path' => $path, 'updated_at' => now()],
        );

        if (is_string($previous) && str_starts_with($previous, 'mirai-social/avatars/')) {
            Storage::disk('local')->delete($previous);
        }

        return new JsonResponse(['profile' => ['avatar_url' => $this->avatarUrl($userId, now()->toIso8601String())]], 201);
    }

    public function remove(Request $request): JsonResponse
    {
        $userId = (int) $request->user()->id;
        $path = DB::table('ext_mirai_social_profiles')->where('user_id', $userId)->value('avatar_path');
        DB::table('ext_mirai_social_profiles')->where('user_id', $userId)->delete();

        if (is_string($path) && str_starts_with($path, 'mirai-social/avatars/')) {
            Storage::disk('local')->delete($path);
        }

        return new JsonResponse(['profile' => ['avatar_url' => null]]);
    }

    public function avatar(Request $request, int $user): Response
    {
        abort_unless(User::query()->whereKey($user)->exists(), 404);
        $path = DB::table('ext_mirai_social_profiles')->where('user_id', $user)->value('avatar_path');
        abort_unless(is_string($path) && str_starts_with($path, 'mirai-social/avatars/') && Storage::disk('local')->exists($path), 404);

        return Storage::disk('local')->response($path, null, [
            'Cache-Control' => 'private, max-age=3600',
            'X-Content-Type-Options' => 'nosniff',
        ]);
    }

    private function avatarUrl(int $userId, string $version): string
    {
        return '/api/client/extensions/mirai-social/avatar/'.$userId.'?v='.rawurlencode($version);
    }
}
