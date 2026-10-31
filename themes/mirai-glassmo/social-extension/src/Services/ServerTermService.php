<?php

declare(strict_types=1);

namespace MiraiSocial\Services;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Pterodactyl\Actions\Servers\ToggleServerSuspension;
use Pterodactyl\Models\Server;

class ServerTermService
{
    public function processExpirations(): void
    {
        DB::table('ext_mirai_social_server_terms')->whereNotNull('expires_at')->where('expires_at', '<=', now())
            ->whereNull('expired_at')->orderBy('server_id')->chunkById(50, function ($terms): void {
                foreach ($terms as $term) {
                    try {
                        $server = Server::query()->find($term->server_id);
                        if (! $server) continue;
                        $suspendedByExpiry = false;
                        if (! $server->isSuspended()) {
                            app(ToggleServerSuspension::class)->toggle($server, ToggleServerSuspension::ACTION_SUSPEND);
                            $suspendedByExpiry = true;
                        }
                        DB::table('ext_mirai_social_server_terms')->where('server_id', $server->id)->whereNull('expired_at')->update([
                            'expired_at' => now(), 'suspended_by_expiry' => $suspendedByExpiry, 'updated_at' => now(),
                        ]);
                    } catch (\Throwable $error) {
                        Log::warning('Mirai Social could not suspend an expired server term; it will retry.', ['server_id' => $term->server_id, 'error' => $error->getMessage()]);
                    }
                }
            }, 'server_id');

        DB::table('ext_mirai_social_server_terms')->where('suspended_by_expiry', true)->where('expires_at', '>', now())
            ->orderBy('server_id')->chunkById(50, function ($terms): void {
                foreach ($terms as $term) {
                    try {
                        $server = Server::query()->find($term->server_id);
                        if ($server && $server->isSuspended()) {
                            app(ToggleServerSuspension::class)->toggle($server, ToggleServerSuspension::ACTION_UNSUSPEND);
                        }
                        DB::table('ext_mirai_social_server_terms')->where('server_id', $term->server_id)->update(['suspended_by_expiry' => false, 'updated_at' => now()]);
                    } catch (\Throwable $error) {
                        Log::warning('Mirai Social could not restore a renewed server term; it will retry.', ['server_id' => $term->server_id, 'error' => $error->getMessage()]);
                    }
                }
            }, 'server_id');
    }
}
