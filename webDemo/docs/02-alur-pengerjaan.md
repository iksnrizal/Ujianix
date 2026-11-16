# Alur Pengerjaan Ujianix

Dokumen ini mengatur urutan kerja tim. Tahapan teknis dapat diperinci setelah pembagian tugas dan pemeriksaan kondisi repository disepakati.

## Tahap 1 — Fondasi kerja tim

1. Membuat repository pengembangan aktif.
2. Memberikan akses kepada seluruh anggota.
3. Menambahkan dokumentasi rancangan dan alur kerja.
4. Menyepakati aturan branch, commit, dan Pull Request.
5. Menetapkan job desk final enam anggota.

**Keluaran:** repository aktif, dokumentasi awal, dan pembagian tanggung jawab yang disepakati.

## Tahap 2 — Prototipe dasar ISO

1. Memastikan lingkungan build dan dependensi.
2. Menetapkan versi Debian stabil yang digunakan untuk prototipe.
3. Menyiapkan konfigurasi pembangun ISO.
4. Membangun ISO minimal.
5. Menguji boot pada mesin virtual atau perangkat milik sendiri.
6. Mencatat ukuran ISO, waktu boot, dan penggunaan RAM.

**Keluaran:** ISO baseline yang dapat diuji dan catatan hasil pengujian. Keberhasilan belum boleh diklaim sebelum ada bukti.

## Tahap 3 — Lingkungan kiosk dan pembatasan

1. Menyiapkan sesi grafis minimal.
2. Menjalankan browser kiosk secara otomatis.
3. Menguji apakah peserta dapat keluar dari lingkungan ujian.
4. Menguji pembatasan akses sistem.
5. Mencatat hasil dan celah yang ditemukan.

## Tahap 4 — Jaringan dan konfigurasi admin

1. Merancang format konfigurasi admin.
2. Membaca konfigurasi saat boot.
3. Menerapkan whitelist sebelum antarmuka ujian muncul.
4. Menguji mode online dan offline.
5. Menentukan dan menguji validasi integritas konfigurasi.

Detail teknis yang belum diputuskan harus dibahas dan dicatat sebelum implementasi final.

## Tahap 5 — Server dan pengawasan

1. Menentukan aplikasi ujian demo.
2. Menyiapkan alur komunikasi dengan server ujian.
3. Menyiapkan layanan penerima data pengawasan.
4. Menguji pengiriman jawaban dan data pengawasan.
5. Memastikan pemberitahuan privasi dan pengelolaan data dijelaskan.

## Tahap 6 — Instalasi, integritas, dan rilis

1. Menambahkan mekanisme instalasi ke disk.
2. Memastikan mode Live dan install memiliki kemampuan setara.
3. Menyiapkan checksum dan tanda tangan GPG sesuai rancangan.
4. Menyusun panduan boot/BIOS.
5. Menguji ISO hasil akhir.

## Tahap 7 — Dokumentasi dan demonstrasi

1. Mengumpulkan bukti pengujian dan benchmark.
2. Menyusun laporan 10–20 halaman.
3. Menyusun video demo 3–5 menit.
4. Menyusun slide presentasi.
5. Memeriksa README, lisensi, sumber terbuka, dan pengungkapan penggunaan AI.

## Aturan pelaksanaan

- Pengujian dilakukan pada mesin virtual atau perangkat milik sendiri, bukan infrastruktur kampus tanpa izin.
- Jangan menyatakan fitur selesai sebelum diuji dan bukti dicatat.
- Perubahan keputusan tetap harus melalui kesepakatan kelompok dan dicatat.
