<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ParkController;
use App\Http\Controllers\Api\SoundSourceController;
use App\Http\Controllers\Api\SoundSeedController;
use App\Http\Controllers\Api\QrCodeController;
use App\Http\Controllers\Api\WeatherController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// KODAMA API Routes
Route::prefix('kodama')->group(function () {
    // 公開APIエンドポイント（認証不要）
    Route::get('/parks', [ParkController::class, 'index']);
    Route::get('/parks/{park}', [ParkController::class, 'show']);
    Route::get('/parks/{park}/sound-seeds', [ParkController::class, 'getSoundSeeds']);
    Route::get('/sound-sources', [SoundSourceController::class, 'index']);
    Route::get('/sound-sources/{soundSource}', [SoundSourceController::class, 'show']);
    Route::get('/parks/{park}/weather', [WeatherController::class, 'getCurrentWeather']);
    Route::get('/parks/{park}/weather/history', [WeatherController::class, 'getWeatherHistory']);
    
    // QRコードスキャン（認証不要）
    Route::post('/qr-codes/scan', [QrCodeController::class, 'scan']);

    // 認証が必要なAPIエンドポイント
    Route::middleware('auth:sanctum')->group(function () {
        // 音の種管理
        Route::post('/sound-seeds', [SoundSeedController::class, 'store']);
        Route::put('/sound-seeds/{soundSeed}', [SoundSeedController::class, 'update']);
        Route::delete('/sound-seeds/{soundSeed}', [SoundSeedController::class, 'destroy']);
        
        // ユーザー音源取得
        Route::get('/user/sound-sources', [SoundSourceController::class, 'getUserSoundSources']);
        
        // QRコード購入
        Route::post('/qr-codes/purchase', [QrCodeController::class, 'purchase']);
        Route::post('/sound-sources/purchase-set', [QrCodeController::class, 'purchaseSet']);
        
        // 天候データ更新（管理者用）
        Route::post('/parks/{park}/weather', [WeatherController::class, 'updateWeather']);
    });
});
