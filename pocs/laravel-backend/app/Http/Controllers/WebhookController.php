<?php

namespace App\Http\Controllers;

use App\Jobs\ProcessarDesfecho;
use App\Models\Entrega;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class WebhookController extends Controller
{
    private const TOLERANCIA_SEGUNDOS = 300;

    public function __invoke(Request $request): Response
    {
        // getContent() devolve o corpo ORIGINAL. $request->all() já teria feito o parse.
        $corpoCru = $request->getContent();

        if (! $this->assinaturaValida($corpoCru, $request->header('X-Legitimuz-Signature', ''))) {
            return response()->noContent(401);
        }

        $entrega = $request->header('X-Legitimuz-Delivery', '');

        // INSERT com chave única, não SELECT seguido de INSERT: duas entregas simultâneas passariam.
        $inedita = Entrega::firstOrCreate(['delivery_id' => $entrega])->wasRecentlyCreated;
        if ($inedita) {
            ProcessarDesfecho::dispatch(json_decode($corpoCru, true));
        }

        return response()->noContent(200);
    }

    private function assinaturaValida(string $corpoCru, string $header): bool
    {
        $partes = [];
        foreach (explode(',', $header) as $parte) {
            [$chave, $valor] = array_pad(explode('=', $parte, 2), 2, null);
            $partes[$chave] = $valor;
        }

        if (empty($partes['t']) || empty($partes['v1'])) {
            return false;
        }

        if (abs(time() - (int) $partes['t']) > self::TOLERANCIA_SEGUNDOS) {
            return false;
        }

        $esperada = hash_hmac(
            'sha256',
            $partes['t'].'.'.$corpoCru,
            config('services.legitimuz.webhook_secret')
        );

        return hash_equals($esperada, $partes['v1']);
    }
}
