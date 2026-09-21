<?php

namespace App\Http\Controllers;

use App\Jobs\ProcessOutcome;
use App\Models\Delivery;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class WebhookController extends Controller
{
    private const TOLERANCE_SECONDS = 300;

    public function __invoke(Request $request): Response
    {
        // getContent() devolve o corpo ORIGINAL. $request->all() já teria feito o parse.
        $rawBody = $request->getContent();

        if (! $this->isSignatureValid($rawBody, $request->header('X-Legitimuz-Signature', ''))) {
            return response()->noContent(401);
        }

        $deliveryId = $request->header('X-Legitimuz-Delivery', '');

        // INSERT com chave única, não SELECT seguido de INSERT: duas entregas simultâneas passariam.
        $isNew = Delivery::firstOrCreate(['delivery_id' => $deliveryId])->wasRecentlyCreated;
        if ($isNew) {
            ProcessOutcome::dispatch(json_decode($rawBody, true));
        }

        return response()->noContent(200);
    }

    private function isSignatureValid(string $rawBody, string $header): bool
    {
        $parts = [];
        foreach (explode(',', $header) as $part) {
            [$key, $value] = array_pad(explode('=', $part, 2), 2, null);
            $parts[$key] = $value;
        }

        if (empty($parts['t']) || empty($parts['v1'])) {
            return false;
        }

        if (abs(time() - (int) $parts['t']) > self::TOLERANCE_SECONDS) {
            return false;
        }

        $expected = hash_hmac(
            'sha256',
            $parts['t'].'.'.$rawBody,
            config('services.legitimuz.webhook_secret')
        );

        return hash_equals($expected, $parts['v1']);
    }
}
