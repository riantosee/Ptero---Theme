<?php

declare(strict_types=1);

namespace MiraiSocial\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use Pterodactyl\Facades\Extensions;
use Throwable;

class AiController
{
    public function respond(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'message' => ['required', 'string', 'max:2000'],
            'history' => ['sometimes', 'array', 'max:8'],
            'history.*.role' => ['required_with:history', 'in:user,assistant'],
            'history.*.content' => ['required_with:history', 'string', 'max:1500'],
        ]);

        $settings = Extensions::settings('mirai-social');
        $key = $settings->get('ai_api_key');
        abort_unless((bool) $settings->get('ai_enabled', false) && is_string($key) && $key !== '', 503, 'AI is not configured by the panel administrator yet.');

        $endpoint = $this->validateEndpoint((string) $settings->get('ai_endpoint', 'https://api.openai.com/v1/responses'));
        $format = $settings->get('ai_format', 'responses');

        $input = [];
        foreach (array_slice($validated['history'] ?? [], -6) as $item) {
            $input[] = [
                'role' => $item['role'],
                'content' => trim(strip_tags($item['content'])),
            ];
        }
        $input[] = ['role' => 'user', 'content' => trim(strip_tags($validated['message']))];

        try {
            $client = Http::acceptJson()
                ->withToken($key)
                ->connectTimeout(10)
                ->timeout(45)
                ->withOptions(['allow_redirects' => false]);

            $payload = $format === 'chat_completions'
                ? [
                    'model' => $settings->get('ai_model', 'gpt-4.1-mini'),
                    'messages' => array_merge(
                        [['role' => 'system', 'content' => $settings->get('ai_instructions')]],
                        $input,
                    ),
                    'max_tokens' => 800,
                ]
                : [
                    'model' => $settings->get('ai_model', 'gpt-4.1-mini'),
                    'instructions' => $settings->get('ai_instructions'),
                    'input' => $input,
                    'max_output_tokens' => 800,
                ];

            $response = $client->post($endpoint, $payload);

            if (! $response->successful()) {
                return new JsonResponse(['message' => 'AI provider request failed. Check the endpoint, format, model, and API key in the extension settings.'], 502);
            }

            $text = $format === 'chat_completions'
                ? data_get($response->json(), 'choices.0.message.content', '')
                : collect($response->json('output', []))
                    ->flatMap(fn (array $item) => $item['content'] ?? [])
                    ->filter(fn (array $part) => ($part['type'] ?? null) === 'output_text')
                    ->pluck('text')
                    ->filter(fn ($part) => is_string($part) && trim($part) !== '')
                    ->implode("\n");

            return new JsonResponse(['message' => is_string($text) && trim($text) !== '' ? $text : 'The AI returned an empty response.']);
        } catch (Throwable) {
            return new JsonResponse(['message' => 'Could not reach the AI provider. Try again in a moment.'], 502);
        }
    }

    private function validateEndpoint(string $endpoint): string
    {
        $parts = parse_url(trim($endpoint));
        abort_unless(is_array($parts)
            && strtolower($parts['scheme'] ?? '') === 'https'
            && isset($parts['host'])
            && ! array_key_exists('user', $parts) && ! array_key_exists('pass', $parts) && ! array_key_exists('query', $parts) && ! array_key_exists('fragment', $parts)
            && (! isset($parts['port']) || $parts['port'] === 443), 422, 'The AI endpoint must be a public HTTPS URL on port 443, with no embedded credentials or query string.');

        $host = strtolower(rtrim($parts['host'], '.'));
        abort_if($host === '' || filter_var($host, FILTER_VALIDATE_IP) || Str::endsWith($host, ['.localhost', '.local', '.internal']) || in_array($host, ['localhost', 'metadata.google.internal'], true), 422, 'The AI endpoint host is not allowed.');

        $records = @dns_get_record($host, DNS_A | DNS_AAAA);
        $addresses = [];
        foreach (is_array($records) ? $records : [] as $record) {
            foreach (['ip', 'ipv6'] as $key) {
                if (isset($record[$key]) && filter_var($record[$key], FILTER_VALIDATE_IP)) {
                    $addresses[] = $record[$key];
                }
            }
        }
        abort_unless($addresses !== [], 422, 'The AI endpoint host must resolve to a public IP address.');
        foreach ($addresses as $address) {
            abort_unless(filter_var($address, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE), 422, 'The AI endpoint cannot resolve to a private or reserved IP address.');
        }

        return trim($endpoint);
    }
}
