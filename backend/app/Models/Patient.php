<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['name', 'last_name', 'email', 'phone', 'photo'])]
class Patient extends Model
{
}

