<?php

use App\Http\Controllers\ProductsController;
use Illuminate\Support\Facades\Route;

Route::apiResource('/products', ProductsController::class);
