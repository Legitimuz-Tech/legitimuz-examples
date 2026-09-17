<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class VerificacaoController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        // O documento vem do SEU cadastro, nunca do corpo da requisição.
        $cadastro = $request->user()->cadastro;

        $resposta = Http::withHeaders([
            'X-API-Key' => config('services.legitimuz.api_key'),
        ])->timeout(10)->post('https://api.legitimuz.com/public/verifications', [
            'schema_version' => '1.0',
            'ref_id' => $cadastro->id,
            'document' => ['type' => 'cpf', 'number' => $cadastro->cpf],
            'flow_public_id' => config('services.legitimuz.flow_id'),
        ]);

        if ($resposta->failed()) {
            return response()->json(['erro' => 'legitimuz_indisponivel'], 502);
        }

        $dados = $resposta->json();
        $cadastro->update(['verification_public_id' => $dados['verification']['public_id']]);

        // Só a entry volta ao cliente.
        return response()->json(['entry' => $dados['entry']]);
    }
}
