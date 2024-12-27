<?php

use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\CategoriesController;
use App\Http\Controllers\API\ExpensesController;
use App\Http\Controllers\API\IncomesController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'generateToken']);
    Route::post('/register', [AuthController::class, 'register']);
    Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::resource('categories', CategoriesController::class)->except('create', 'show', 'edit');
    Route::resource('incomes', IncomesController::class)->except('create', 'show', 'edit');
    Route::resource('expenses', ExpensesController::class)->except('create', 'show', 'edit');
    Route::get('categories/{categoryId}/expenses', [ExpensesController::class, 'expensesByCategory']);
});
