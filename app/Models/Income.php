<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Income extends Model
{
    protected $fillable = [
        'user_id',
        'source',
        'amount',
        'description',
    ];
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
