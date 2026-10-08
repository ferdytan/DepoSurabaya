<?php

namespace App\Services;

use App\Models\Customer;
use App\Models\Product;
use App\Models\Role;
use App\Models\Shipper;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use ZipArchive;
use SimpleXMLElement;

class ExcelDataSyncService
{
    /**
     * Daftar entitas yang didukung.
     */
    public const SUPPORTED_ENTITIES = ['customer', 'customers', 'shipper', 'shippers', 'product', 'products', 'user', 'users'];

    /**
     * Normalisasi nama entitas ke bentuk tunggal kanonikal.
     */
    public function normalizeEntity(string $entity): string
    {
        $entity = strtolower(trim($entity));
        return match ($entity) {
            'customer', 'customers' => 'customer',
            'shipper', 'shippers'   => 'shipper',
            'product', 'products'   => 'product',
            'user', 'users'         => 'user',
            default                 => throw new \InvalidArgumentException("Entitas '{$entity}' tidak didukung."),
        };
    }

    /**
     * Generate template CSV (dengan UTF-8 BOM agar langsung rapi di Excel) beserta contoh data.
     */
    public function getTemplate(string $entity): array
    {
        $canonical = $this->normalizeEntity($entity);

        return match ($canonical) {
            'customer' => [
                'filename' => 'template_import_customer.csv',
                'content'  => $this->buildCsv([
                    ['name', 'phone', 'email', 'address', 'city', 'province'],
                    ['PT Samudera Logistik Nusantara', '081234567890', 'kontak@samuderalogistik.com', 'Jl. Perak Timur No. 120', 'Surabaya', 'Jawa Timur'],
                    ['CV Berkah Lautan Mandiri', '081987654321', 'info@berkahlautan.co.id', 'Jl. Tanjung Tembaga No. 45', 'Surabaya', 'Jawa Timur'],
                ]),
            ],
            'shipper' => [
                'filename' => 'template_import_shipper.csv',
                'content'  => $this->buildCsv([
                    ['name', 'phone', 'email', 'address', 'city', 'province'],
                    ['PT Indo Agro Jaya Abadi', '082111223344', 'export@indoagrojaya.com', 'Jl. Mayjen Sungkono No. 88', 'Surabaya', 'Jawa Timur'],
                    ['UD Makmur Hasil Bumi', '085677889900', 'makmur.hasilbumi@gmail.com', 'Jl. Margomulyo Indah Blok B-4', 'Surabaya', 'Jawa Timur'],
                ]),
            ],
            'product' => [
                'filename' => 'template_import_product.csv',
                'content'  => $this->buildCsv([
                    ['service_type', 'requires_temperature', 'price', 'description'],
                    ['Biaya LoLo Full 20\'', 'Tidak', '450000', 'Lift On & Lift Off Kontainer 20ft'],
                    ['Biaya LoLo Full 40\'', 'Tidak', '700000', 'Lift On & Lift Off Kontainer 40ft'],
                    ['Plug In Temperature Monitoring', 'Ya', '150000', 'Layanan Monitoring & Perekaman Suhu Berkala'],
                    ['Pemasangan Terpal Pelindung', 'Tidak', '200000', 'Jasa Pemasangan Cover Terpal Kontainer'],
                ]),
            ],
            'user' => [
                'filename' => 'template_import_user.csv',
                'content'  => $this->buildCsv([
                    ['name', 'username', 'email', 'role', 'password'],
                    ['Budi Prasetyo', 'budip', 'budi@deposurabaya.com', 'Admin', 'password123'],
                    ['Siti Rahmawati', 'sitir', 'siti@deposurabaya.com', 'Checker', 'password123'],
                    ['Ahmad Fauzi', 'ahmadf', 'ahmad@deposurabaya.com', 'Karantina', 'password123'],
                ]),
            ],
        };
    }

    /**
     * Export seluruh data entitas ke format CSV (UTF-8 BOM, kompatibel 100% dengan Excel).
     * Format kolom identik dengan template import ("janjian").
     */
    public function export(string $entity): array
    {
        $canonical = $this->normalizeEntity($entity);
        $dateStr = date('Y-m-d');

        return match ($canonical) {
            'customer' => [
                'filename' => "export_customers_{$dateStr}.csv",
                'content'  => $this->exportCustomers(),
            ],
            'shipper' => [
                'filename' => "export_shippers_{$dateStr}.csv",
                'content'  => $this->exportShippers(),
            ],
            'product' => [
                'filename' => "export_products_{$dateStr}.csv",
                'content'  => $this->exportProducts(),
            ],
            'user' => [
                'filename' => "export_users_{$dateStr}.csv",
                'content'  => $this->exportUsers(),
            ],
        };
    }

    /**
     * Export data Customer.
     */
    protected function exportCustomers(): string
    {
        $rows = [
            ['name', 'phone', 'email', 'address', 'city', 'province']
        ];

        $customers = Customer::orderBy('name')->get();
        foreach ($customers as $c) {
            $rows[] = [
                $c->name,
                $c->phone ?? '',
                $c->email ?? '',
                $c->address ?? '',
                $c->city ?? '',
                $c->province ?? '',
            ];
        }

        return $this->buildCsv($rows);
    }

    /**
     * Export data Shipper.
     */
    protected function exportShippers(): string
    {
        $rows = [
            ['name', 'phone', 'email', 'address', 'city', 'province']
        ];

        $shippers = Shipper::orderBy('name')->get();
        foreach ($shippers as $s) {
            $rows[] = [
                $s->name,
                $s->phone ?? '',
                $s->email ?? '',
                $s->address ?? '',
                $s->city ?? '',
                $s->province ?? '',
            ];
        }

        return $this->buildCsv($rows);
    }

    /**
     * Export data Product.
     */
    protected function exportProducts(): string
    {
        $rows = [
            ['service_type', 'requires_temperature', 'price', 'description']
        ];

        $products = Product::orderBy('service_type')->get();
        foreach ($products as $p) {
            $productPrice = $p->price 
                ?? $p->price_global 
                ?? $p->price_20ft 
                ?? $p->price_40ft 
                ?? $p->price_45ft 
                ?? 0;

            $rows[] = [
                $p->service_type,
                $p->requires_temperature == 1 ? 'Ya' : 'Tidak',
                $productPrice !== null ? (string) $productPrice : '0',
                $p->description ?? '',
            ];
        }

        return $this->buildCsv($rows);
    }

    /**
     * Export data User.
     */
    protected function exportUsers(): string
    {
        $rows = [
            ['name', 'username', 'email', 'role', 'password']
        ];

        $users = User::with('role')->orderBy('name')->get();
        foreach ($users as $u) {
            $rows[] = [
                $u->name,
                $u->username ?? '',
                $u->email,
                $u->role?->name ?? 'User',
                '', // Password dikosongkan demi keamanan saat export
            ];
        }

        return $this->buildCsv($rows);
    }

    /**
     * Import berkas data (CSV atau XLSX) untuk entitas yang dipilih.
     */
    public function import(string $entity, string $filePath): array
    {
        $canonical = $this->normalizeEntity($entity);
        $parsedRows = $this->parseFileToRows($filePath);

        if (empty($parsedRows)) {
            throw new \Exception('File kosong atau tidak memiliki data yang valid.');
        }

        // Header mapping
        $headerRaw = array_shift($parsedRows);
        $headerMap = $this->createHeaderMap($headerRaw);

        if (empty($headerMap)) {
            throw new \Exception('Header kolom file tidak dikenali. Pastikan menggunakan format template yang disediakan.');
        }

        return match ($canonical) {
            'customer' => $this->importCustomers($parsedRows, $headerMap),
            'shipper'  => $this->importShippers($parsedRows, $headerMap),
            'product'  => $this->importProducts($parsedRows, $headerMap),
            'user'     => $this->importUsers($parsedRows, $headerMap),
        };
    }

    /**
     * Import baris Customer ke DB (Update jika sudah ada, Insert jika baru).
     */
    protected function importCustomers(array $rows, array $headerMap): array
    {
        $created = 0;
        $updated = 0;
        $failed = 0;
        $errors = [];

        foreach ($rows as $index => $row) {
            $rowNum = $index + 2;
            $name = trim($this->getVal($row, $headerMap, ['name', 'nama', 'customer_name', 'nama_customer']));

            if (empty($name)) {
                $failed++;
                $errors[] = "Baris {$rowNum}: Nama customer wajib diisi.";
                continue;
            }

            $phone    = trim($this->getVal($row, $headerMap, ['phone', 'telepon', 'no_telepon', 'telp']));
            $email    = trim($this->getVal($row, $headerMap, ['email']));
            $address  = trim($this->getVal($row, $headerMap, ['address', 'alamat']));
            $city     = trim($this->getVal($row, $headerMap, ['city', 'kota']));
            $province = trim($this->getVal($row, $headerMap, ['province', 'provinsi']));

            try {
                // Cari customer berdasarkan nama atau email
                $customer = null;
                if (!empty($email)) {
                    $customer = Customer::where('email', $email)->first();
                }
                if (!$customer) {
                    $customer = Customer::where('name', $name)->first();
                }

                $data = [
                    'name'     => $name,
                    'phone'    => $phone ?: null,
                    'email'    => $email ?: null,
                    'address'  => $address ?: null,
                    'city'     => $city ?: null,
                    'province' => $province ?: null,
                ];

                if ($customer) {
                    $customer->update($data);
                    $updated++;
                } else {
                    Customer::create($data);
                    $created++;
                }
            } catch (\Throwable $e) {
                $failed++;
                $errors[] = "Baris {$rowNum} ('{$name}'): " . $e->getMessage();
            }
        }

        return [
            'entity'  => 'Customer',
            'total'   => count($rows),
            'created' => $created,
            'updated' => $updated,
            'failed'  => $failed,
            'errors'  => array_slice($errors, 0, 10), // Maksimal 10 error teratas
        ];
    }

    /**
     * Import baris Shipper ke DB.
     */
    protected function importShippers(array $rows, array $headerMap): array
    {
        $created = 0;
        $updated = 0;
        $failed = 0;
        $errors = [];

        foreach ($rows as $index => $row) {
            $rowNum = $index + 2;
            $name = trim($this->getVal($row, $headerMap, ['name', 'nama', 'shipper_name', 'nama_shipper']));

            if (empty($name)) {
                $failed++;
                $errors[] = "Baris {$rowNum}: Nama shipper wajib diisi.";
                continue;
            }

            $phone    = trim($this->getVal($row, $headerMap, ['phone', 'telepon', 'no_telepon', 'telp']));
            $email    = trim($this->getVal($row, $headerMap, ['email']));
            $address  = trim($this->getVal($row, $headerMap, ['address', 'alamat']));
            $city     = trim($this->getVal($row, $headerMap, ['city', 'kota']));
            $province = trim($this->getVal($row, $headerMap, ['province', 'provinsi']));

            try {
                $shipper = null;
                if (!empty($email)) {
                    $shipper = Shipper::where('email', $email)->first();
                }
                if (!$shipper) {
                    $shipper = Shipper::where('name', $name)->first();
                }

                $data = [
                    'name'     => $name,
                    'phone'    => $phone ?: null,
                    'email'    => $email ?: null,
                    'address'  => $address ?: null,
                    'city'     => $city ?: null,
                    'province' => $province ?: null,
                ];

                if ($shipper) {
                    $shipper->update($data);
                    $updated++;
                } else {
                    Shipper::create($data);
                    $created++;
                }
            } catch (\Throwable $e) {
                $failed++;
                $errors[] = "Baris {$rowNum} ('{$name}'): " . $e->getMessage();
            }
        }

        return [
            'entity'  => 'Shipper',
            'total'   => count($rows),
            'created' => $created,
            'updated' => $updated,
            'failed'  => $failed,
            'errors'  => array_slice($errors, 0, 10),
        ];
    }

    /**
     * Import baris Product ke DB.
     */
    protected function importProducts(array $rows, array $headerMap): array
    {
        $created = 0;
        $updated = 0;
        $failed = 0;
        $errors = [];

        foreach ($rows as $index => $row) {
            $rowNum = $index + 2;
            $serviceType = trim($this->getVal($row, $headerMap, [
                'service_type', 'nama', 'layanan', 'jenis_layanan', 'produk', 'name'
            ]));

            if (empty($serviceType)) {
                $failed++;
                $errors[] = "Baris {$rowNum}: Jenis layanan wajib diisi.";
                continue;
            }

            $reqTempRaw = strtolower(trim($this->getVal($row, $headerMap, [
                'requires_temperature', 'rekam_suhu', 'suhu', 'temperature'
            ])));
            $requiresTemperature = in_array($reqTempRaw, ['1', 'ya', 'yes', 'y', 'true', 'wajib suhu']) ? 1 : 0;

            $price   = $this->parseNumber($this->getVal($row, $headerMap, ['price', 'tarif', 'harga', 'price_global', 'tarif_global', 'harga_global']));
            $p20     = $this->parseNumber($this->getVal($row, $headerMap, ['price_20ft', 'tarif_20ft', 'harga_20ft', '20ft']));
            $p40     = $this->parseNumber($this->getVal($row, $headerMap, ['price_40ft', 'tarif_40ft', 'harga_40ft', '40ft']));
            $p45     = $this->parseNumber($this->getVal($row, $headerMap, ['price_45ft', 'tarif_45ft', 'harga_45ft', '45ft']));
            $desc    = trim($this->getVal($row, $headerMap, ['description', 'keterangan', 'deskripsi']));

            if ($price === 0.0) {
                $price = max($p20, $p40, $p45);
            }

            try {
                $product = Product::whereRaw('LOWER(service_type) = ?', [strtolower($serviceType)])->first();

                $data = [
                    'service_type'         => $serviceType,
                    'requires_temperature' => $requiresTemperature,
                    'price'                => $price > 0 ? $price : 0,
                    'description'          => $desc ?: null,
                ];

                if ($product) {
                    $product->update($data);
                    $updated++;
                } else {
                    Product::create($data);
                    $created++;
                }
            } catch (\Throwable $e) {
                $failed++;
                $errors[] = "Baris {$rowNum} ('{$serviceType}'): " . $e->getMessage();
            }
        }

        return [
            'entity'  => 'Product',
            'total'   => count($rows),
            'created' => $created,
            'updated' => $updated,
            'failed'  => $failed,
            'errors'  => array_slice($errors, 0, 10),
        ];
    }

    /**
     * Import baris User ke DB.
     */
    protected function importUsers(array $rows, array $headerMap): array
    {
        $created = 0;
        $updated = 0;
        $failed = 0;
        $errors = [];

        // Cache roles
        $roles = Role::all();
        $defaultRole = $roles->firstWhere('name', 'Admin') ?? $roles->first();

        foreach ($rows as $index => $row) {
            $rowNum = $index + 2;
            $name     = trim($this->getVal($row, $headerMap, ['name', 'nama', 'nama_lengkap']));
            $username = trim($this->getVal($row, $headerMap, ['username', 'user_name']));
            $email    = trim($this->getVal($row, $headerMap, ['email']));
            $roleName = trim($this->getVal($row, $headerMap, ['role', 'peran', 'jabatan']));
            $password = trim($this->getVal($row, $headerMap, ['password', 'sandi']));

            if (empty($name) || empty($email)) {
                $failed++;
                $errors[] = "Baris {$rowNum}: Nama dan Email pengguna wajib diisi.";
                continue;
            }

            if (empty($username)) {
                // Buat username default dari email bila kosong
                $username = strtolower(explode('@', $email)[0]);
            }

            // Cari role yang cocok
            $roleId = $defaultRole?->id;
            if (!empty($roleName)) {
                $matchedRole = $roles->first(function ($r) use ($roleName) {
                    return strcasecmp($r->name, $roleName) === 0;
                });
                if ($matchedRole) {
                    $roleId = $matchedRole->id;
                }
            }

            try {
                $user = User::where('email', $email)
                    ->orWhere('username', $username)
                    ->first();

                if ($user) {
                    $updateData = [
                        'name'     => $name,
                        'username' => $username,
                        'email'    => $email,
                        'role_id'  => $roleId,
                    ];
                    if (!empty($password)) {
                        $updateData['password'] = Hash::make($password);
                    }
                    $user->update($updateData);
                    $updated++;
                } else {
                    $newPass = !empty($password) ? $password : 'password123';
                    User::create([
                        'name'              => $name,
                        'username'          => $username,
                        'email'             => $email,
                        'role_id'           => $roleId,
                        'password'          => Hash::make($newPass),
                        'email_verified_at' => now(),
                    ]);
                    $created++;
                }
            } catch (\Throwable $e) {
                $failed++;
                $errors[] = "Baris {$rowNum} ('{$email}'): " . $e->getMessage();
            }
        }

        return [
            'entity'  => 'User',
            'total'   => count($rows),
            'created' => $created,
            'updated' => $updated,
            'failed'  => $failed,
            'errors'  => array_slice($errors, 0, 10),
        ];
    }

    /**
     * Parse berkas yang diunggah (.csv, .txt, .xlsx) menjadi array baris.
     */
    public function parseFileToRows(string $filePath): array
    {
        if (!file_exists($filePath)) {
            throw new \Exception("Berkas tidak ditemukan: {$filePath}");
        }

        // Cek apakah file adalah ZIP (XLSX)
        $handle = fopen($filePath, 'rb');
        $magic = fread($handle, 4);
        fclose($handle);

        if ($magic === "PK\x03\x04" && class_exists('ZipArchive')) {
            $xlsxRows = $this->parseXlsxFile($filePath);
            if (!empty($xlsxRows)) {
                return $xlsxRows;
            }
        }

        // Fallback parse sebagai CSV / TSV / Delimited Text
        return $this->parseCsvFile($filePath);
    }

    /**
     * Parser native ringan untuk file XLSX tanpa dependensi package eksternal.
     */
    protected function parseXlsxFile(string $filePath): array
    {
        $zip = new ZipArchive();
        if ($zip->open($filePath) !== true) {
            return [];
        }

        // 1. Baca shared strings bila ada
        $sharedStrings = [];
        $stringsXml = $zip->getFromName('xl/sharedStrings.xml');
        if ($stringsXml !== false) {
            try {
                $xml = new SimpleXMLElement($stringsXml);
                foreach ($xml->si as $si) {
                    if (isset($si->t)) {
                        $sharedStrings[] = (string) $si->t;
                    } elseif (isset($si->r)) {
                        $text = '';
                        foreach ($si->r as $r) {
                            $text .= (string) $r->t;
                        }
                        $sharedStrings[] = $text;
                    } else {
                        $sharedStrings[] = '';
                    }
                }
            } catch (\Throwable $e) {
                // Abaikan jika XML shared strings bermasalah
            }
        }

        // 2. Baca worksheet pertama (sheet1.xml)
        $sheetXml = $zip->getFromName('xl/worksheets/sheet1.xml');
        if ($sheetXml === false) {
            // Coba cari nama sheet lain
            for ($i = 0; $i < $zip->numFiles; $i++) {
                $name = $zip->getNameIndex($i);
                if (str_starts_with($name, 'xl/worksheets/sheet') && str_ends_with($name, '.xml')) {
                    $sheetXml = $zip->getFromIndex($i);
                    break;
                }
            }
        }

        $zip->close();

        if ($sheetXml === false) {
            return [];
        }

        $rows = [];
        try {
            $xml = new SimpleXMLElement($sheetXml);
            if (!isset($xml->sheetData->row)) {
                return [];
            }

            foreach ($xml->sheetData->row as $r) {
                $rowCells = [];
                $maxCol = 0;

                foreach ($r->c as $c) {
                    $cellRef = (string) $c['r'];
                    $colLetters = preg_replace('/[0-9]/', '', $cellRef);
                    $colIndex = $this->colLetterToIndex($colLetters);
                    $maxCol = max($maxCol, $colIndex);

                    $type = (string) $c['t'];
                    $val = '';

                    if ($type === 's') {
                        $sIndex = (int) $c->v;
                        $val = $sharedStrings[$sIndex] ?? '';
                    } elseif ($type === 'inlineStr' && isset($c->is->t)) {
                        $val = (string) $c->is->t;
                    } elseif (isset($c->v)) {
                        $val = (string) $c->v;
                    }

                    $rowCells[$colIndex] = trim($val);
                }

                // Normalisasi baris dengan panjang yang sama
                $fullRow = [];
                for ($i = 0; $i <= $maxCol; $i++) {
                    $fullRow[$i] = $rowCells[$i] ?? '';
                }

                // Abaikan baris yang seluruhnya kosong
                if (count(array_filter($fullRow, fn($v) => $v !== '')) > 0) {
                    $rows[] = $fullRow;
                }
            }
        } catch (\Throwable $e) {
            return [];
        }

        return $rows;
    }

    /**
     * Konversi huruf kolom Excel (e.g. 'A', 'B', 'AA') ke indeks 0-based.
     */
    protected function colLetterToIndex(string $letters): int
    {
        $letters = strtoupper($letters);
        $len = strlen($letters);
        $index = 0;

        for ($i = 0; $i < $len; $i++) {
            $index = $index * 26 + (ord($letters[$i]) - 64);
        }

        return $index - 1;
    }

    /**
     * Parser CSV / Delimited Text dengan auto-detect pemisah (koma, titik-koma, tab).
     */
    protected function parseCsvFile(string $filePath): array
    {
        $content = file_get_contents($filePath);
        if ($content === false) {
            return [];
        }

        // Hilangkan BOM UTF-8 bila ada
        if (str_starts_with($content, "\xEF\xBB\xBF")) {
            $content = substr($content, 3);
        }

        // Deteksi delimiter dari baris pertama
        $lines = preg_split("/\r\n|\n|\r/", trim($content));
        if (empty($lines)) {
            return [];
        }

        $firstLine = $lines[0];
        $commaCount = substr_count($firstLine, ',');
        $semicolonCount = substr_count($firstLine, ';');
        $tabCount = substr_count($firstLine, "\t");

        $delimiter = ',';
        if ($semicolonCount > $commaCount && $semicolonCount > $tabCount) {
            $delimiter = ';';
        } elseif ($tabCount > $commaCount && $tabCount > $semicolonCount) {
            $delimiter = "\t";
        }

        $rows = [];
        $stream = fopen('php://memory', 'r+');
        fwrite($stream, $content);
        rewind($stream);

        while (($data = fgetcsv($stream, 0, $delimiter)) !== false) {
            // Bersihkan string dan abaikan bila seluruh baris kosong
            $cleaned = array_map(fn($v) => trim($v ?? ''), $data);
            if (count(array_filter($cleaned, fn($v) => $v !== '')) > 0) {
                $rows[] = $cleaned;
            }
        }

        fclose($stream);
        return $rows;
    }

    /**
     * Pemetaan nama kolom dari header row.
     */
    protected function createHeaderMap(array $headerRow): array
    {
        $map = [];
        foreach ($headerRow as $index => $colName) {
            $normalized = strtolower(trim($colName));
            $normalized = str_replace([' ', '-', '.'], '_', $normalized);
            if (!empty($normalized)) {
                $map[$normalized] = $index;
            }
        }
        return $map;
    }

    /**
     * Ambil nilai dari kolom berdasarkan daftar alias yang mungkin.
     */
    protected function getVal(array $row, array $headerMap, array $aliases): string
    {
        foreach ($aliases as $alias) {
            $aliasNorm = strtolower(str_replace([' ', '-', '.'], '_', $alias));
            if (isset($headerMap[$aliasNorm])) {
                $colIndex = $headerMap[$aliasNorm];
                return $row[$colIndex] ?? '';
            }
        }
        return '';
    }

    /**
     * Format angka dari input teks (menghilangkan Rp, titik/koma ribuan).
     */
    protected function parseNumber(string $val): float
    {
        $cleaned = trim($val);
        if ($cleaned === '') {
            return 0.0;
        }

        // Hapus "Rp", spasi
        $cleaned = preg_replace('/[Rr][Pp]\s*/', '', $cleaned);
        $cleaned = preg_replace('/[^\d.,-]/', '', $cleaned);

        // Jika format Indonesia 450.000,00 -> ubah ke 450000.00
        if (str_contains($cleaned, '.') && str_contains($cleaned, ',')) {
            $cleaned = str_replace('.', '', $cleaned);
            $cleaned = str_replace(',', '.', $cleaned);
        } elseif (str_contains($cleaned, '.')) {
            // Cek apakah titik sebagai ribuan (e.g. 450.000)
            if (preg_match('/\.\d{3}$/', $cleaned)) {
                $cleaned = str_replace('.', '', $cleaned);
            }
        } elseif (str_contains($cleaned, ',')) {
            // Cek apakah koma sebagai ribuan atau desimal
            if (preg_match('/,\d{3}$/', $cleaned)) {
                $cleaned = str_replace(',', '', $cleaned);
            } else {
                $cleaned = str_replace(',', '.', $cleaned);
            }
        }

        return (float) $cleaned;
    }

    /**
     * Helper untuk membuat string CSV dengan UTF-8 BOM.
     */
    protected function buildCsv(array $rows, string $delimiter = ','): string
    {
        $handle = fopen('php://memory', 'r+');
        // Tulis UTF-8 BOM agar Excel di Windows otomatis membuka dengan encoding UTF-8
        fwrite($handle, "\xEF\xBB\xBF");

        foreach ($rows as $row) {
            fputcsv($handle, $row, $delimiter);
        }

        rewind($handle);
        $csvContent = stream_get_contents($handle);
        fclose($handle);

        return $csvContent;
    }
}
