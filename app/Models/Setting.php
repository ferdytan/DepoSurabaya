<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Schema;

class Setting extends Model
{
    use HasFactory;

    protected $fillable = [
        'key',
        'value',
    ];

    /**
     * Safely get a setting value with fallback default
     */
    public static function get(string $key, mixed $default = null): mixed
    {
        try {
            if (!Schema::hasTable('settings')) {
                return $default;
            }

            $setting = static::where('key', $key)->first();
            return $setting && $setting->value !== null ? $setting->value : $default;
        } catch (\Throwable $e) {
            return $default;
        }
    }

    /**
     * Safely set a setting value
     */
    public static function set(string $key, mixed $value): ?static
    {
        try {
            if (!Schema::hasTable('settings')) {
                return null;
            }

            return static::updateOrCreate(
                ['key' => $key],
                ['value' => (string) $value]
            );
        } catch (\Throwable $e) {
            return null;
        }
    }
}
