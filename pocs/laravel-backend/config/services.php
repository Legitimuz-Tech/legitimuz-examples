<?php

// Acrescente este bloco ao config/services.php do seu projeto.
return [

    'legitimuz' => [
        'api_key' => env('LEGITIMUZ_API_KEY'),
        'webhook_secret' => env('LEGITIMUZ_WEBHOOK_SECRET'),
        'flow_id' => env('LEGITIMUZ_FLOW_ID'),
    ],

];
