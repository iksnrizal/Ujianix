# Keputusan Teknis Ujianix

Dokumen ini membedakan keputusan rancangan yang sudah ditetapkan dari pilihan teknis yang masih terbuka.

## A. Keputusan rancangan yang menjadi acuan

| Aspek | Keputusan |
|---|---|
| Basis sistem | Debian minimal |
| Arsitektur | x86_64 / 64-bit |
| Ukuran ISO sasaran | 600 MB–1 GB |
| RAM minimum sasaran | 1 GB |
| Tampilan | Kiosk penuh |
| Mode penggunaan | Live USB dan install ke disk |
| Mode server | Hybrid online dan offline |
| Jaringan | Whitelist dari konfigurasi admin |
| Jawaban | Dikirim ke server, tidak disimpan permanen lokal |
| Integritas | Root read-only, GPG, checksum, panduan BIOS |
| Lisensi | GPL |

## B. Pilihan yang masih terbuka

| Topik | Status |
|---|---|
| Versi Debian final untuk prototipe | Perlu ditetapkan saat prototipe |
| Aplikasi ujian untuk demo | Belum dipilih |
| Browser | Dipilih berdasarkan prototipe dan pengukuran |
| Sistem tampilan | X minimal/window manager atau Wayland; perlu diuji |
| Installer | Kandidat Calamares atau Debian Installer; belum dipilih |
| Detail tanda tangan/HMAC konfigurasi USB | Perlu diputuskan saat prototipe |
| Secure Boot | Target opsional setelah fitur inti |
| Pembagian tugas final | Belum ditetapkan |

## C. Aturan perubahan

Keputusan utama rancangan tidak diubah sepihak. Usulan perubahan harus:
1. Menjelaskan alasan dan dampaknya.
2. Dibahas dan disetujui kelompok.
3. Dicatat dalam dokumen ini beserta tanggal dan keputusan.

## D. Catatan implementasi

Kandidat alat dan teknologi pada dokumen rancangan merupakan kandidat untuk diuji, bukan jaminan kompatibilitas atau hasil yang sudah terbukti. Versi paket dan dukungan teknis harus diverifikasi pada lingkungan build yang dipilih.
