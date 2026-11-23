# UJIANIX

**Distro Linux khusus untuk lingkungan ujian berbasis komputer.**

Ujianix merupakan distribusi Linux berbasis Debian yang dirancang untuk menyediakan lingkungan ujian yang lebih terarah melalui browser kiosk, konfigurasi administrator, serta fitur pengawasan peserta yang dapat dikonfigurasi.

> Ujianix menyediakan sistem operasi dan lingkungan pelaksanaan ujian. Platform, website, maupun aplikasi ujian disediakan oleh institusi atau penyelenggara ujian.

---

## Tentang Ujianix

Ujianix dikembangkan untuk membantu penyelenggara ujian menyediakan lingkungan komputer yang lebih terkontrol bagi peserta. Sistem dirancang agar peserta dapat menjalankan ujian melalui browser dalam mode kiosk, sementara pengaturan sistem dikelola melalui antarmuka administrator.

Ujianix bertujuan mempersulit dan membantu mendeteksi potensi kecurangan, bukan menjamin bahwa kecurangan sepenuhnya tidak mungkin dilakukan.

## Fitur

- **Mode Try Ujianix** — menjalankan Ujianix secara langsung dari media bootable.
- **Mode Install Ujianix** — memasang sistem ke perangkat melalui installer.
- **Browser kiosk** — menjalankan Firefox ESR dalam lingkungan kiosk.
- **Konfigurasi administrator** — mengelola pengaturan sistem melalui antarmuka lokal.
- **Pengaturan akses ujian** — mengatur URL atau tujuan halaman ujian.
- **Sistem pengawasan** — mendukung pengiriman screenshot dan foto webcam ke server pengawas terpisah, sesuai konfigurasi dan hasil pengujian.
- **Pemberitahuan privasi** — peserta diminta menyetujui pemberitahuan sebelum pengawasan dimulai, ketika fitur pengawasan diaktifkan.

> Status implementasi, pengujian, dan keterbatasan masing-masing fitur dijelaskan dalam dokumentasi terkait. Tidak semua fitur keamanan telah dinyatakan selesai atau teruji.

## Teknologi

| Komponen | Peran |
|---|---|
| Debian 13 (Trixie) | Basis sistem operasi |
| Linux | Kernel sistem |
| live-build | Pembuatan sistem live dan ISO |
| Cage | Lingkungan kiosk berbasis Wayland |
| Firefox ESR | Browser untuk lingkungan ujian |
| Calamares | Installer sistem |
| systemd | Pengelolaan layanan sistem |
| Python | Implementasi layanan konfigurasi dan server pengawas |
| grim | Pengambilan screenshot layar |
| fswebcam | Pengambilan foto webcam |

Versi komponen dapat berubah mengikuti pembaruan proyek.

## Gambaran sistem

Secara umum, Ujianix terdiri dari sistem operasi berbasis Debian, lingkungan kiosk untuk menjalankan browser, layanan konfigurasi administrator, installer, dan komponen pengawasan terpisah.

Alur penggunaan utama:

1. Pengguna melakukan boot dari media Ujianix.
2. Pengguna memilih **Try Ujianix** atau **Install Ujianix**.
3. Ujianix menjalankan lingkungan kiosk.
4. Administrator melakukan konfigurasi awal dan menentukan tujuan halaman ujian.
5. Peserta menjalankan ujian melalui browser kiosk.
6. Jika pengawasan diaktifkan dan dikonfigurasi, sistem menjalankan alur pemberitahuan privasi serta pengiriman data pengawasan sesuai implementasi.

## Persyaratan

### Untuk menjalankan Ujianix

- Komputer dengan arsitektur AMD64 (x86-64).
- Media bootable berisi ISO Ujianix.
- Perangkat yang kompatibel dengan proses boot BIOS atau UEFI; kompatibilitas UEFI perlu merujuk pada hasil pengujian yang tersedia.
- Kebutuhan RAM dan perangkat keras minimum mengikuti hasil benchmark dan pengujian proyek.

### Untuk membangun ISO

Persyaratan lingkungan build, dependensi, konfigurasi, dan langkah pembuatan ISO akan dijelaskan pada [BUILD.md](BUILD.md) apabila panduan tersebut tersedia di repository.

## Menjalankan Ujianix

1. Siapkan media bootable berisi ISO Ujianix.
2. Boot komputer dari media tersebut.
3. Pilih **Try Ujianix** untuk menjalankan sistem live atau **Install Ujianix** untuk memasang sistem.
4. Ikuti alur konfigurasi yang ditampilkan.
5. Administrator mengatur tujuan halaman ujian dan pengaturan lain yang diperlukan.
6. Pastikan sistem dan jaringan sesuai dengan kebutuhan penyelenggara sebelum ujian dimulai.

Panduan lebih rinci tersedia pada dokumentasi pengguna dan instalasi di direktori `build/`.

## Dokumentasi

Dokumentasi proyek yang tersedia di repository:

| Dokumen | Keterangan |
|---|---|
| [Dokumentasi Arsitektur Sistem](build/arsitektur-sistem-ujianix.md) | Gambaran arsitektur dan komponen sistem Ujianix. |
| [Dokumentasi Benchmark dan Evaluasi](build/Dokumentasi-Benchmark-dan-Evaluasi-Ujianix.md) | Pengukuran dan evaluasi sistem. |
| [Dokumentasi Sistem Pengawasan Peserta](build/Dokumentasi-Sistem-Pengawasan-Peserta-Ujianix.md) | Penjelasan sistem pengawasan peserta. |
| [Dokumentasi Pengujian Sistem](build/dokumentasi-pengujian-sistem-ujianix.md) | Skenario, hasil, dan catatan pengujian sistem. |
| [Panduan Instalasi dan Penggunaan](build/panduan-instalasi-penggunaan-ujianix.md) | Panduan instalasi serta penggunaan Ujianix. |

> Tautan dokumentasi perlu disesuaikan jika nama atau lokasi file di repository berubah.

## Keamanan dan privasi

Ujianix dirancang untuk mendukung lingkungan ujian yang lebih terkontrol. Namun, sistem tidak dapat menjamin pencegahan seluruh bentuk kecurangan atau serangan.

Fitur pengawasan dapat melibatkan pengambilan screenshot dan foto webcam serta pengiriman data ke server pengawas terpisah. Pengawasan harus dikonfigurasi sesuai kebutuhan, disertai pemberitahuan kepada peserta, dan diterapkan dengan memperhatikan kebijakan privasi serta ketentuan yang berlaku.

Fitur pembatasan keamanan seperti firewall whitelist, pembatasan akses konsol, penguncian parameter boot, dan kebijakan browser harus dinilai berdasarkan status implementasi dan hasil pengujian aktual. Jangan menganggap fitur tersebut telah aktif hanya karena tercantum sebagai rencana.

## Batasan

- Ujianix menyediakan lingkungan sistem operasi; aplikasi atau platform ujian bukan bagian yang otomatis disediakan oleh proyek.
- Ujianix bukan jaminan bahwa kecurangan tidak dapat dilakukan.
- Kompatibilitas perangkat keras dan firmware dapat berbeda.
- Fitur pengawasan memerlukan konfigurasi server, jaringan, dan perangkat yang sesuai.
- Status fitur keamanan dan performa bergantung pada hasil pengujian build yang digunakan.
- Dukungan, performa, dan kompatibilitas pada perangkat nyata perlu divalidasi melalui pengujian.

## Kontribusi dan pengembangan

Dokumentasi, konfigurasi, dan komponen Ujianix dikembangkan serta diperbarui melalui repository ini. Perubahan sebaiknya disertai catatan yang jelas dan hasil pengujian yang relevan.

## Lisensi

Informasi lisensi proyek dan komponen yang digunakan akan dicantumkan setelah lisensi distribusi Ujianix ditetapkan dan dokumentasi lisensi diperiksa.

---

<p align="center"><strong>UJIANIX — lingkungan sistem operasi untuk pelaksanaan ujian yang lebih terarah.</strong></p>
