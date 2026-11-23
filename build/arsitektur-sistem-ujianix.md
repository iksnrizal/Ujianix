# Dokumentasi Arsitektur Sistem UJIANIX

**Nama Proyek:** UJIANIX  
**Kategori:** Sistem Operasi Khusus Ujian  
**Basis Sistem:** Debian 13 (Trixie) AMD64  
**Format Dokumentasi:** Markdown (`.md`)

---

## 1. Pendahuluan

UJIANIX merupakan distribusi Linux berbasis Debian 13 (Trixie) yang dirancang khusus untuk mendukung pelaksanaan ujian berbasis komputer. Sistem ini menyediakan lingkungan ujian yang terbatas dengan menggunakan browser dalam mode kiosk, sehingga peserta diarahkan untuk mengakses aplikasi atau halaman ujian yang telah ditentukan.

UJIANIX juga menyediakan fitur konfigurasi administrator dan sistem pengawasan visual opsional. Pengawasan dilakukan melalui pengiriman screenshot layar dan foto webcam ke server pengawas yang terpisah dari perangkat peserta.

UJIANIX berfungsi sebagai sistem operasi pendukung pelaksanaan ujian. Aplikasi atau website ujian tetap disediakan oleh institusi penyelenggara.

## 2. Tujuan Arsitektur Sistem

Arsitektur sistem UJIANIX dirancang untuk:

1. Menyediakan sistem operasi berbasis Linux yang dikhususkan untuk pelaksanaan ujian.
2. Membatasi lingkungan penggunaan peserta melalui browser mode kiosk.
3. Menyediakan konfigurasi sistem yang dapat dikelola oleh administrator.
4. Mendukung instalasi sistem melalui installer Calamares.
5. Menyediakan mekanisme pengawasan visual secara opsional.
6. Memisahkan proses pengawasan peserta dari sistem operasi yang digunakan peserta.

## 3. Gambaran Umum Arsitektur

UJIANIX dibangun menggunakan beberapa komponen yang saling terintegrasi. Sistem menggunakan Debian 13 sebagai basis sistem operasi, live-build untuk membangun ISO, Cage sebagai lingkungan kiosk, Firefox ESR sebagai browser ujian, Calamares sebagai installer, serta systemd untuk mengelola layanan sistem.

Backend konfigurasi dikembangkan menggunakan Python dengan pustaka standar, sedangkan antarmuka konfigurasi menggunakan HTML dan CSS lokal.

Secara umum, arsitektur UJIANIX terdiri dari beberapa bagian berikut:

- **Lapisan Sistem Operasi:** Debian 13 sebagai fondasi sistem.
- **Lapisan Boot dan Inisialisasi:** Mengatur proses boot dan pemilihan mode penggunaan.
- **Lapisan Antarmuka:** Menampilkan halaman splash, konfigurasi administrator, dan browser ujian.
- **Lapisan Layanan:** Menjalankan layanan konfigurasi dan pengawasan.
- **Lapisan Instalasi:** Menyediakan proses instalasi UJIANIX ke perangkat.
- **Lapisan Pengawasan:** Mengirimkan data pengawasan ke server pengawas eksternal.

## 4. Teknologi yang Digunakan

| Teknologi | Fungsi |
|---|---|
| Debian 13 (Trixie) | Sistem operasi dasar |
| live-build | Membangun image ISO UJIANIX |
| Syslinux | Bootloader untuk mode BIOS pada media live |
| GRUB | Bootloader untuk sistem UEFI dan sistem terpasang |
| Cage | Menyediakan lingkungan Wayland untuk aplikasi kiosk |
| Firefox ESR | Browser untuk mengakses halaman ujian |
| Calamares | Installer sistem operasi |
| systemd | Mengelola layanan dan proses saat sistem berjalan |
| Python 3 | Backend konfigurasi dan agen pengawasan |
| HTML dan CSS | Antarmuka konfigurasi lokal |
| grim | Mengambil screenshot layar |
| fswebcam | Mengambil gambar dari webcam |

## 5. Komponen Utama Sistem

### 5.1 Sistem Operasi Debian

UJIANIX menggunakan Debian 13 (Trixie) AMD64 sebagai sistem operasi dasar. Debian menyediakan kernel Linux, manajemen paket, pustaka sistem, serta layanan dasar yang dibutuhkan oleh komponen UJIANIX.

### 5.2 Sistem Boot

Sistem boot bertugas memulai sistem dan menentukan mode penggunaan UJIANIX.

Terdapat dua pilihan utama:

- **Try Ujianix:** Menjalankan sistem secara langsung dari media bootable.
- **Install Ujianix:** Memulai proses instalasi UJIANIX ke perangkat melalui Calamares.

Pada mode BIOS, proses boot menggunakan Syslinux. Sementara itu, GRUB digunakan untuk dukungan UEFI dan sistem yang telah terpasang.

### 5.3 Antarmuka Kiosk

UJIANIX menggunakan Cage dan Firefox ESR untuk membangun lingkungan ujian berbasis kiosk.

Cage menyediakan lingkungan tampilan Wayland, sedangkan Firefox ESR dijalankan dalam mode kiosk untuk membuka halaman ujian secara penuh.

Peserta diarahkan menggunakan browser tersebut sebagai antarmuka utama selama pelaksanaan ujian.

### 5.4 Layanan Konfigurasi Administrator

Layanan konfigurasi dikembangkan menggunakan Python dan dijalankan secara lokal melalui alamat `127.0.0.1:8765`.

Fitur utamanya meliputi:

- Pendaftaran administrator pertama.
- Login administrator.
- Dashboard konfigurasi.
- Pengaturan alamat server ujian.
- Pengaturan mode jaringan.
- Pengaturan whitelist.
- Pengaturan screenshot dan webcam.
- Pengaturan pemberitahuan privasi.

Konfigurasi disimpan pada `/etc/ujianix/ujianix.conf`, sedangkan informasi autentikasi administrator disimpan secara terpisah pada `/etc/ujianix/admin-auth`.

Administrator dapat membuka halaman konfigurasi melalui tombol F2 ketika layar splash ditampilkan.

### 5.5 Layanan Pengawasan

UJIANIX menyediakan agen pengawasan yang berjalan sebagai layanan systemd.

Agen ini mendukung dua jenis pengambilan gambar:

1. Screenshot layar menggunakan `grim`.
2. Foto webcam menggunakan `fswebcam`.

Data yang diperoleh dikirim melalui HTTP POST ke server pengawas yang dijalankan secara terpisah pada komputer pengawas.

Pengambilan gambar hanya dimulai setelah peserta menyetujui pemberitahuan privasi melalui tombol **Saya mengerti**.

### 5.6 Installer Calamares

Calamares digunakan untuk memasang UJIANIX ke perangkat penyimpanan.

Installer menyediakan tahapan pemilihan partisi, pembuatan akun pengguna, proses instalasi, dan penyelesaian instalasi.

Bahasa sistem dikonfigurasi menggunakan locale Indonesia (`id_ID`), zona waktu Asia/Jakarta, serta konfigurasi keyboard US.

## 6. Diagram Arsitektur Sistem

Diagram berikut menunjukkan hubungan antara komponen utama UJIANIX.

```mermaid
flowchart TB
    A[Media Bootable UJIANIX]
    B[Bootloader]
    C{Pemilihan Mode}

    A --> B
    B --> C

    C -->|Try Ujianix| D[Sistem Live Debian]
    C -->|Install Ujianix| E[Calamares Installer]

    D --> F[systemd]
    F --> G[Layanan Konfigurasi]
    F --> H[Layanan Pengawasan]
    F --> I[Cage]

    I --> J[Firefox ESR Kiosk]
    J --> K[Halaman Splash]
    K --> L[Halaman Ujian]

    G --> M[Konfigurasi Administrator]
    M --> N[/etc/ujianix/ujianix.conf]

    H --> O[grim / fswebcam]
    O --> P[Server Pengawas Eksternal]

    E --> Q[Sistem UJIANIX Terpasang]
    Q --> F
```

## 7. Arsitektur Komunikasi

Komunikasi antarkomponen pada UJIANIX dibagi menjadi komunikasi lokal dan komunikasi jaringan.

### 7.1 Komunikasi Lokal

Komunikasi lokal berlangsung di dalam perangkat peserta.

Contohnya:

- Firefox ESR mengakses halaman konfigurasi melalui `127.0.0.1:8765`.
- Layanan konfigurasi membaca dan memvalidasi berkas konfigurasi.
- Agen pengawasan membaca status persetujuan privasi melalui `/run/ujianix/ack`.
- systemd menjalankan dan mengelola layanan UJIANIX.

### 7.2 Komunikasi dengan Server Pengawas

Komunikasi dengan server pengawas dilakukan melalui jaringan lokal.

Alurnya:

1. Komputer pengawas menjalankan server Python.
2. Administrator memasukkan alamat server pengawas pada konfigurasi UJIANIX.
3. Peserta menyetujui pemberitahuan privasi.
4. Agen pengawasan mengambil screenshot dan/atau gambar webcam sesuai konfigurasi.
5. Data dikirim menggunakan HTTP POST ke endpoint `/upload`.
6. Server pengawas menerima dan menyimpan data.
7. Data ditampilkan melalui halaman galeri pemantauan.

Server pengawas menyediakan tampilan galeri, status perangkat, daftar kejadian, dan fitur pengunduhan data dalam format ZIP.

## 8. Alur Kerja Sistem

### 8.1 Alur Try Ujianix

Mode Try digunakan untuk menjalankan UJIANIX secara langsung dari media bootable tanpa melakukan instalasi permanen.

Tahapan proses:

1. Perangkat melakukan boot dari media UJIANIX.
2. Sistem Debian dijalankan dalam mode live.
3. systemd mengaktifkan layanan yang diperlukan.
4. Sistem melakukan autologin pada terminal utama.
5. Cage menjalankan Firefox ESR dalam mode kiosk.
6. Firefox menampilkan halaman splash UJIANIX.
7. Jika belum dikonfigurasi, administrator diarahkan ke halaman setup.
8. Jika konfigurasi sudah tersedia, sistem melanjutkan ke halaman ujian.
9. Jika pengawasan diaktifkan, peserta harus menyetujui pemberitahuan privasi terlebih dahulu.
10. Setelah persetujuan diberikan, proses pengawasan dapat dimulai.

Pada mode Try, konfigurasi sesi tidak dipertahankan setelah perangkat dimatikan karena persistence dinonaktifkan.

### 8.2 Alur Install Ujianix

Mode Install digunakan untuk memasang sistem UJIANIX ke perangkat.

Tahapan proses:

1. Pengguna memilih menu Install Ujianix.
2. Sistem menjalankan Calamares.
3. Pengguna mengikuti tahapan instalasi.
4. Pengguna menentukan partisi dan membuat akun.
5. Calamares memasang sistem UJIANIX ke perangkat.
6. Setelah instalasi selesai, perangkat melakukan boot ke sistem terpasang.
7. Layanan systemd menjalankan komponen UJIANIX.
8. Sistem menampilkan halaman konfigurasi atau splash sesuai kondisi konfigurasi.

Berbeda dengan mode Try, konfigurasi administrator pada sistem terpasang disimpan secara permanen.

### 8.3 Alur Pengawasan Peserta

Pengawasan merupakan fitur opsional yang menggunakan server terpisah.

Tahapan proses:

1. Administrator mengaktifkan fitur screenshot dan/atau webcam.
2. Administrator mengatur alamat server pengawas dan interval pengiriman.
3. Sistem menampilkan pemberitahuan privasi kepada peserta.
4. Peserta menekan tombol **Saya mengerti**.
5. Sistem mencatat persetujuan melalui endpoint `/ack`.
6. Agen pengawasan mulai mengambil gambar sesuai konfigurasi.
7. Gambar dikirim ke server pengawas.
8. Server menyimpan data dan menampilkannya pada halaman galeri.

Gambar pengawasan tidak ditulis ke disk peserta berdasarkan rancangan sistem yang digunakan.

## 9. Struktur Komponen dan Direktori

Komponen utama UJIANIX ditempatkan pada direktori konfigurasi live-build.

| Direktori atau File | Keterangan |
|---|---|
| `config/package-lists/` | Daftar paket yang digunakan |
| `config/hooks/live/` | Skrip konfigurasi saat proses build |
| `config/bootloaders/` | Konfigurasi bootloader |
| `config/includes.chroot_after_packages/` | File dan komponen yang dimasukkan ke sistem |
| `usr/local/sbin/ujianix-config-server` | Backend konfigurasi administrator |
| `usr/local/sbin/ujianix-load-config` | Validator konfigurasi |
| `usr/local/sbin/ujianix-supervisor-agent` | Agen pengawasan peserta |
| `usr/local/sbin/ujianix-boot-mode` | Pendeteksi mode Try atau Install |
| `usr/local/sbin/ujianix-getty` | Pengaturan autologin |
| `usr/local/bin/ujianix-installer` | Peluncur installer Calamares |
| `etc/systemd/system/` | Konfigurasi layanan systemd |
| `etc/ujianix/` | Penyimpanan konfigurasi sistem |
| `usr/share/ujianix/` | Halaman antarmuka dan aset UJIANIX |
| `etc/calamares/` | Konfigurasi installer |
| `tools/pengawas/` | Program server pengawas untuk Windows |

## 10. Keamanan dan Privasi

UJIANIX dirancang untuk membantu membatasi penggunaan perangkat selama ujian dan mendukung pengawasan peserta.

Beberapa mekanisme yang diterapkan atau dirancang meliputi:

- Browser Firefox ESR dijalankan dalam mode kiosk.
- Konfigurasi administrator dilindungi autentikasi.
- Password administrator disimpan menggunakan PBKDF2-SHA256.
- Akun peserta pada sistem terpasang tidak dimasukkan ke grup sudo.
- Layanan konfigurasi hanya menerima koneksi lokal.
- Pengambilan gambar pengawasan menunggu persetujuan peserta.
- Pengiriman data pengawasan dilakukan ke server pengawas terpisah.

**Catatan status keamanan:** Mekanisme whitelist jaringan, penutupan konsol teks, penguncian parameter boot, dan kebijakan pembatasan Firefox masih memerlukan implementasi serta pengujian. Oleh karena itu, fitur-fitur tersebut belum dapat dinyatakan selesai.

UJIANIX membantu mempersulit dan mendeteksi potensi kecurangan, tetapi tidak menjamin seluruh bentuk kecurangan dapat dicegah.

## 11. Keterbatasan Sistem

Beberapa keterbatasan yang perlu diperhatikan:

1. Mode Try tidak mempertahankan konfigurasi setelah perangkat dimatikan.
2. Sistem membutuhkan koneksi jaringan untuk mengirimkan data ke server pengawas.
3. Fitur pengawasan bergantung pada ketersediaan webcam dan izin akses perangkat.
4. Website atau aplikasi ujian disediakan oleh institusi, bukan bagian dari UJIANIX.
5. Pengujian boot UEFI masih diperlukan.
6. Efektivitas pembatasan keamanan masih memerlukan pengujian lanjutan.

## 12. Kesimpulan

Arsitektur UJIANIX mengintegrasikan Debian 13, live-build, Cage, Firefox ESR, Calamares, systemd, dan layanan berbasis Python untuk membangun sistem operasi khusus ujian.

Sistem menyediakan dua mode penggunaan, yaitu Try Ujianix dan Install Ujianix. Selain itu, tersedia konfigurasi administrator melalui antarmuka lokal serta fitur pengawasan visual opsional yang terhubung ke server pengawas eksternal.

Arsitektur ini menjadi dasar pengembangan UJIANIX sebagai sistem operasi pendukung ujian berbasis komputer yang memiliki lingkungan penggunaan terarah dan mekanisme pengawasan terintegrasi.
