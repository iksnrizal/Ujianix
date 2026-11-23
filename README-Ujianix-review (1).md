# Ujianix

Ujianix adalah proyek pengembangan distro Linux khusus ujian yang dirancang untuk menyediakan lingkungan ujian terkontrol melalui mode kiosk. Repository ini mencakup prototipe berbasis konfigurasi Debian Live dan dokumentasi pengembangan lanjutan.

## Anggota kelompok

1. Muhammad Mufti Faried — 257006111070
2. Fasha Octa Ramdani — 257006111076
3. M Ikhsan Al Rizal — 257006111086
4. Agnia Agustin Ramadani — 257006111090
5. Azizah Dwi Suryaningtyas — 257006111092
6. Nazwa Nurul Aulia — 257006111094

## Tujuan

- Menyediakan lingkungan ujian yang membatasi akses peserta ke sistem.
- Mendukung penggunaan server ujian online maupun server lokal (offline).
- Membatasi koneksi jaringan berdasarkan whitelist yang disiapkan admin.
- Mendukung mekanisme pengawasan visual sesuai konfigurasi dan pemberitahuan privasi.

Ujianix bertujuan membantu membatasi dan mendeteksi kecurangan di sisi komputer peserta. Ujianix tidak menjamin kecurangan mustahil dilakukan; kecurangan di luar komputer peserta berada di luar jangkauan perangkat lunak.

## Status pengembangan

Repository ini memuat konfigurasi dan dokumentasi prototipe Ujianix di folder `build/`, serta materi rancangan dan pengembangan lanjutan di `webDemo/`. Status keberhasilan build ISO dan pengujian harus merujuk pada dokumentasi pengujian, bukan dianggap berhasil hanya karena konfigurasi tersedia.

## Navigasi repository

### Prototipe Ujianix (`build/`)

- [README prototipe](build/README-Ujianix.md)
- [Panduan build ISO](build/BUILD-Ujianix.md)
- [Changelog](build/CHANGELOG-Ujianix.md)
- [Arsitektur sistem](build/arsitektur-sistem-ujianix.md)
- [Panduan instalasi dan penggunaan](build/panduan-instalasi-penggunaan-ujianix.md)
- [Dokumentasi pengujian](build/dokumentasi-pengujian-sistem-ujianix.md)
- [Benchmark dan evaluasi](build/Dokumentasi-Benchmark-dan-Evaluasi-Ujianix.md)
- [Sistem pengawasan peserta](build/Dokumentasi-Sistem-Pengawasan-Peserta-Ujianix.md)
- [Keamanan dan privasi](build/SECURITY-AND-PRIVACY-Ujianix.md)
- [Sumber dan lisensi komponen](build/SOURCES-AND-LICENSES-Ujianix.md)
- [Troubleshooting](build/TROUBLESHOOTING-Ujianix.md)

### Pengembangan lanjutan (`webDemo/`)

Folder `webDemo/` berisi materi rancangan, alur pengerjaan, pembagian tugas, keputusan teknis, serta rencana pengujian untuk pengembangan lanjutan.

- [Rancangan proyek](webDemo/docs/01-rancangan-proyek.md)
- [Alur pengerjaan](webDemo/docs/02-alur-pengerjaan.md)
- [Pembagian tugas](webDemo/docs/03-pembagian-tugas.md)
- [Keputusan teknis](webDemo/docs/04-keputusan-teknis.md)
- [Rencana pengujian](webDemo/docs/05-pengujian/test-plan.md)

## Persyaratan sasaran

Persyaratan dan ukuran performa yang dicantumkan dalam dokumentasi merupakan sasaran rancangan atau hasil pengujian sesuai status yang dinyatakan di dokumen masing-masing. Periksa dokumentasi build dan pengujian sebelum menggunakannya pada kegiatan ujian.

## Kontribusi

Kontribusi dilakukan melalui branch terpisah dan Pull Request. Jangan melakukan commit langsung ke `main` kecuali telah disepakati oleh pengelola repository.

## Lisensi

Informasi lisensi proyek dan komponen perlu mengikuti file lisensi serta dokumentasi sumber yang disertakan di repository.
