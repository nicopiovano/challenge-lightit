<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

#[Fillable(['name', 'last_name', 'email', 'phone', 'photo'])]
class Patient extends Model
{
    use HasFactory;
}

