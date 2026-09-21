<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class VerificationController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        // O documento vem do SEU cadastro, nunca do corpo da requisição.
        $registration = $request->user()->registration;

        $response = Http::withHeaders([
            'X-API-Key' => config('services.legitimuz.api_key'),
        ])->timeout(10)->post('https://api.legitimuz.com/public/verifications', [
            'schema_version' => '1.0',
            'ref_id' => $registration->id,
            'document' => ['type' => 'cpf', 'number' => $registration->cpf],
            'flow_public_id' => config('services.legitimuz.flow_id'),
        ]);

        if ($response->failed()) {
            return response()->json(['error' => 'legitimuz_unavailable'], 502);
        }

        $data = $response->json();
        $registration->update(['verification_public_id' => $data['verification']['public_id']]);

        // Só a entry volta ao cliente.
        return response()->json(['entry' => $data['entry']]);
    }
}
