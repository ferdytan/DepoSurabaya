<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    protected static ?bool $hasIsActiveColumn = null;

    /**
     * Pastikan kolom is_active ada di database atau coba tambahkan secara otomatis.
     */
    public static function hasIsActiveColumn(): bool
    {
        if (static::$hasIsActiveColumn !== null) {
            return static::$hasIsActiveColumn;
        }

        try {
            if (\Illuminate\Support\Facades\Schema::hasColumn('users', 'is_active')) {
                return static::$hasIsActiveColumn = true;
            }

            \Illuminate\Support\Facades\Schema::table('users', function (\Illuminate\Database\Schema\Blueprint $table) {
                if (!\Illuminate\Support\Facades\Schema::hasColumn('users', 'is_active')) {
                    $table->boolean('is_active')->default(true)->after('role_id');
                }
            });

            return static::$hasIsActiveColumn = \Illuminate\Support\Facades\Schema::hasColumn('users', 'is_active');
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::warning("Could not auto-add 'is_active' to users: " . $e->getMessage());
            return static::$hasIsActiveColumn = false;
        }
    }

    protected static function boot()
    {
        parent::boot();

        static::saving(function ($model) {
            if (array_key_exists('is_active', $model->attributes)) {
                if (!static::hasIsActiveColumn()) {
                    unset($model->attributes['is_active']);
                }
            }
        });
    }

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'username',
        'name',
        'email',
        'password',
        'role_id',
        'is_active',
        'email_verified_at'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
        ];
    }

    /**
     * Get the role that owns the user.
     */
    public function role()
    {
        return $this->belongsTo(Role::class);
    }
}
