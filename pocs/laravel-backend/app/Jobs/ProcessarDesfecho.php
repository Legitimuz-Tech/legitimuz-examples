<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

/** Job vazio de propósito. A lógica de negócio é sua. */
class ProcessarDesfecho implements ShouldQueue
{
    use Queueable;

    public function __construct(private array $evento) {}

    public function handle(): void
    {
        // Substitua pela sua implementação.
    }
}
