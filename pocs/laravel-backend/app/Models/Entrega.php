<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/** Guarda o X-Legitimuz-Delivery já processado. Precisa de índice único em delivery_id. */
class Entrega extends Model
{
    protected $fillable = ['delivery_id'];
}
