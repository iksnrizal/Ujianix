# Rencana Pengujian Ujianix

**Status:** Rencana; belum merupakan hasil pengujian.

## 1. Benchmark

| ID | Pengujian | Data yang dicatat | Status |
|---|---|---|---|
| B-01 | Ukuran ISO | Ukuran file ISO | Belum diuji |
| B-02 | Waktu boot | Durasi dari boot hingga siap | Belum diuji |
| B-03 | RAM saat idle | Penggunaan RAM setelah sistem siap | Belum diuji |
| B-04 | RAM saat ujian berjalan | Penggunaan RAM saat browser/ujian aktif | Belum diuji |

## 2. Uji fungsional

| ID | Skenario | Hasil yang diharapkan | Status |
|---|---|---|---|
| F-01 | Boot Live USB/ISO | Sistem berhasil masuk lingkungan Ujianix | Belum diuji |
| F-02 | Boot hasil instalasi | Sistem hasil instalasi dapat dijalankan | Belum diuji |
| F-03 | Kiosk otomatis | Browser ujian terbuka otomatis | Belum diuji |
| F-04 | Whitelist jaringan | Akses jaringan dibatasi sesuai konfigurasi | Belum diuji |
| F-05 | Mode online | Peserta dapat terhubung ke server ujian online | Belum diuji |
| F-06 | Mode offline | Peserta dapat terhubung ke server lokal pengawas | Belum diuji |

## 3. Uji pembatasan/anti-curang

| ID | Skenario | Hasil yang diharapkan | Status |
|---|---|---|---|
| S-01 | Mencoba keluar dari kiosk | Peserta tetap berada dalam lingkungan ujian | Belum diuji |
| S-02 | Mencoba membuka terminal | Akses terminal peserta dibatasi | Belum diuji |
| S-03 | Mencoba mengakses situs di luar whitelist | Koneksi ditolak | Belum diuji |
| S-04 | Mencoba mengubah konfigurasi | Perubahan tidak sah ditolak sesuai mekanisme validasi | Belum diuji |
| S-05 | Menguji perangkat USB | Kebijakan perangkat berjalan sesuai rancangan | Belum diuji |

## 4. Uji pengguna dan privasi

- Simulasikan ujian oleh beberapa pengguna.
- Catat kendala penggunaan.
- Pastikan pemberitahuan pengawasan ditampilkan sebelum ujian.
- Verifikasi data pengawasan dikirim ke server yang ditentukan.
- Dokumentasikan pengelolaan dan penghapusan data oleh institusi.

## 5. Lingkungan dan bukti

Pengujian dilakukan pada mesin virtual atau perangkat milik sendiri. Jangan menggunakan infrastruktur kampus tanpa izin.

Untuk setiap pengujian, catat:
- Tanggal dan lingkungan pengujian.
- Versi ISO/commit yang diuji.
- Langkah reproduksi.
- Hasil yang diharapkan.
- Hasil aktual.
- Bukti tangkapan layar/log.
- Status: Lulus, Gagal, atau Belum diuji.

**Penting:** jangan mengubah status menjadi Lulus sebelum pengujian benar-benar dilakukan dan buktinya tersedia.
