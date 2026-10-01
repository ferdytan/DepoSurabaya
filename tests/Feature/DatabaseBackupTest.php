<?php

namespace Tests\Feature;

use App\Models\Role;
use App\Models\User;
use App\Services\DatabaseBackupService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\File;
use Tests\TestCase;

class DatabaseBackupTest extends TestCase
{
    use RefreshDatabase;

    protected string $backupDir;

    protected function setUp(): void
    {
        parent::setUp();

        $this->backupDir = storage_path('app/private/backups_test');
        config(['backup.path' => $this->backupDir]);
        File::ensureDirectoryExists($this->backupDir);
    }

    protected function tearDown(): void
    {
        if (File::isDirectory($this->backupDir)) {
            File::deleteDirectory($this->backupDir);
        }

        parent::tearDown();
    }

    protected function createSuperAdminUser(): User
    {
        $role = Role::firstOrCreate(['id' => 1], ['name' => 'Super User']);

        return User::factory()->create([
            'role_id' => $role->id,
            'email_verified_at' => now(),
        ]);
    }

    protected function createRegularUser(int $roleId = 2, string $roleName = 'Admin'): User
    {
        $role = Role::firstOrCreate(['id' => $roleId], ['name' => $roleName]);

        return User::factory()->create([
            'role_id' => $role->id,
            'email_verified_at' => now(),
        ]);
    }

    public function test_guest_is_redirected_to_login_when_accessing_bckp(): void
    {
        $response = $this->get('/bckp');
        $response->assertRedirect('/login');
    }

    public function test_guest_is_redirected_to_login_when_downloading_backup(): void
    {
        $response = $this->get('/bckp/download/backup-test-2026.sql.gz');
        $response->assertRedirect('/login');
    }

    public function test_regular_user_or_admin_is_forbidden_from_bckp(): void
    {
        $adminUser = $this->createRegularUser(2, 'Admin');

        $response = $this->actingAs($adminUser)->get('/bckp');
        $response->assertStatus(403);

        $checkerUser = $this->createRegularUser(3, 'Checker');
        $response2 = $this->actingAs($checkerUser)->get('/bckp');
        $response2->assertStatus(403);
    }

    public function test_regular_user_cannot_download_backup(): void
    {
        $adminUser = $this->createRegularUser(2, 'Admin');

        // Buat file dummy
        $dummyFile = $this->backupDir . '/backup-test-2026.sql.gz';
        file_put_contents($dummyFile, 'dummy content');

        $response = $this->actingAs($adminUser)->get('/bckp/download/backup-test-2026.sql.gz');
        $response->assertStatus(403);
    }

    public function test_super_admin_can_view_bckp_page(): void
    {
        $superAdmin = $this->createSuperAdminUser();

        $response = $this->actingAs($superAdmin)->get('/bckp');
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('bckp/index')
            ->has('backups')
            ->has('stats')
        );
    }

    public function test_super_admin_can_download_valid_backup_file(): void
    {
        $superAdmin = $this->createSuperAdminUser();

        $filename = 'backup-depo_test-2026-10-01_00-01-00.sql.gz';
        $fullPath = $this->backupDir . '/' . $filename;
        file_put_contents($fullPath, 'fake-gz-content');

        $response = $this->actingAs($superAdmin)->get("/bckp/download/{$filename}");

        $response->assertStatus(200);
        $this->assertStringContainsString('no-store', (string) $response->headers->get('Cache-Control'));
        $this->assertTrue($response->headers->has('content-disposition'));
        $this->assertStringContainsString($filename, (string) $response->headers->get('content-disposition'));
    }

    public function test_path_traversal_attempts_are_blocked(): void
    {
        $superAdmin = $this->createSuperAdminUser();

        // Coba akses parent directory dengan ..
        $response = $this->actingAs($superAdmin)->get('/bckp/download/..%2F..%2F.env');
        $this->assertContains($response->getStatusCode(), [400, 403, 404]);

        // Coba ekstensi tidak diizinkan (.env, .php, .txt)
        $response2 = $this->actingAs($superAdmin)->get('/bckp/download/.env');
        $this->assertContains($response2->getStatusCode(), [400, 403, 404]);

        $response3 = $this->actingAs($superAdmin)->get('/bckp/download/malicious.php');
        $this->assertContains($response3->getStatusCode(), [400, 403, 404]);
    }

    public function test_failed_backup_does_not_leave_temporary_or_final_file(): void
    {
        $service = new DatabaseBackupService();
        $originalDefault = config('database.default');

        try {
            // Atur koneksi tidak valid untuk memicu kegagalan
            config(['database.default' => 'invalid_driver_connection']);
            config(['database.connections.invalid_driver_connection' => [
                'driver' => 'non_existent_driver',
                'database' => 'dummy',
            ]]);

            $service->runBackup();
            $this->fail('Harusnya melempar exception.');
        } catch (\Throwable $e) {
            $this->assertStringContainsString('belum didukung', $e->getMessage());
        } finally {
            config(['database.default' => $originalDefault]);
        }

        // Pastikan tidak ada file tertinggal di direktori backup
        $files = File::files($this->backupDir);
        $this->assertEmpty($files);
    }

    public function test_artisan_db_backup_command_runs_on_sqlite(): void
    {
        $tempDb = tempnam(sys_get_temp_dir(), 'test_sqlite_');
        $sqlite = new \SQLite3($tempDb);
        $sqlite->exec('CREATE TABLE test_data (id INT, note TEXT); INSERT INTO test_data VALUES (1, "depo");');
        $sqlite->close();

        $originalDb = config('database.connections.sqlite.database');
        config(['database.connections.sqlite.database' => $tempDb]);

        try {
            $this->artisan('db:backup')
                ->assertExitCode(0);

            $files = File::files($this->backupDir);
            $this->assertNotEmpty($files);

            $filename = $files[0]->getFilename();
            $this->assertStringEndsWith('.sqlite.gz', $filename);
            $this->assertStringStartsWith('backup-', $filename);
        } finally {
            config(['database.connections.sqlite.database' => $originalDb]);
            if (file_exists($tempDb)) {
                @unlink($tempDb);
            }
        }
    }
}
