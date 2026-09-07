/**
 * Konversi angka rupiah menjadi teks terbilang bahasa Indonesia.
 * Contoh: 1500000 -> "Satu Juta Lima Ratus Ribu Rupiah"
 */
export function terbilang(n: number): string {
    const num = Math.floor(Math.abs(n || 0));
    if (num === 0) return 'Nol Rupiah';

    const satuan = ['', 'Satu', 'Dua', 'Tiga', 'Empat', 'Lima', 'Enam', 'Tujuh', 'Delapan', 'Sembilan', 'Sepuluh', 'Sebelas'];

    function toWords(val: number): string {
        if (val < 12) return satuan[val];
        if (val < 20) return `${toWords(val - 10)} Belas`;
        if (val < 100) return `${toWords(Math.floor(val / 10))} Puluh ${satuan[val % 10]}`.trim();
        if (val < 200) return `Seratus ${toWords(val - 100)}`.trim();
        if (val < 1000) return `${satuan[Math.floor(val / 100)]} Ratus ${toWords(val % 100)}`.trim();
        if (val < 2000) return `Seribu ${toWords(val - 1000)}`.trim();
        if (val < 1000000) return `${toWords(Math.floor(val / 1000))} Ribu ${toWords(val % 1000)}`.trim();
        if (val < 1000000000) return `${toWords(Math.floor(val / 1000000))} Juta ${toWords(val % 1000000)}`.trim();
        if (val < 1000000000000) return `${toWords(Math.floor(val / 1000000000))} Miliar ${toWords(val % 1000000000)}`.trim();
        return `${toWords(Math.floor(val / 1000000000000))} Triliun ${toWords(val % 1000000000000)}`.trim();
    }

    const words = toWords(num).replace(/\s+/g, ' ');
    return `${words} Rupiah`;
}
