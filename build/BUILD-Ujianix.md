# Panduan Build Ujianix

Panduan ini menjelaskan gambaran lingkungan dan langkah untuk membangun ISO Ujianix dari konfigurasi repository. Perintah dan konfigurasi harus disesuaikan dengan versi repository yang digunakan.

> **Catatan status:** panduan ini disusun dari konfigurasi dan catatan pengembangan Ujianix yang tersedia. Build pada mesin lain tetap perlu diuji. Jangan menganggap hasil build berhasil sebelum log dan ISO hasilnya diperiksa.

## 1. Lingkungan build

Ujianix dikembangkan menggunakan:

- Debian 13 (Trixie), AMD64.
- live-build Debian (versi pengembangan yang tercatat: `20250505+deb13u1`).
- Repository konfigurasi Ujianix.
- Ruang disk dan memori yang memadai untuk proses build; kebutuhan aktual bergantung pada lingkungan.

Build disarankan dilakukan di lingkungan Debian 13, termasuk lingkungan Linux virtual atau WSL yang sesuai. Hindari menjalankan build dari filesystem Windows yang memiliki perilaku izin file berbeda; simpan repository di filesystem Linux.

## 2. Persiapan

Pastikan:

- Debian 13 tersedia dan dapat digunakan.
- Repository Ujianix sudah di-clone atau disalin ke direktori kerja Linux.
- Pengguna memiliki akses sudo.
- Koneksi internet tersedia untuk mengambil paket dari mirror Debian.
- Ruang disk tersedia untuk paket, chroot, dan artefak build.

Masuk ke direktori repository yang berisi folder `config/` dan berkas konfigurasi build.

## 3. Struktur konfigurasi

Konfigurasi live-build berada di folder `config/`. Beberapa bagian yang digunakan dalam pengembangan Ujianix meliputi:

- `config/package-lists/` — daftar paket yang dipasang pada image.
- `config/hooks/live/` — skrip hook untuk menyesuaikan sistem selama proses build.
- `config/includes.chroot_after_packages/` — file dan skrip yang disalin ke sistem target setelah tahap instalasi paket.
- `config/` — konfigurasi live-build dan komponen pendukung lainnya.

Struktur dan nama subdirektori dapat berbeda mengikuti commit repository.

## 4. Build menggunakan skrip

Jika repository menyediakan skrip `build-ujianix.sh`, periksa isi skrip terlebih dahulu, kemudian jalankan dari direktori repository:

```bash
sudo bash build-ujianix.sh
```

Skrip build dapat melakukan persiapan konfigurasi, mengatur izin file, menjalankan live-build, serta membantu memeriksa atau menyimpan hasil build. Periksa dokumentasi skrip dan log untuk mengetahui langkah yang dijalankan pada versi repository tersebut.

## 5. Build manual menggunakan live-build

Jika skrip build tidak tersedia atau build dilakukan secara manual, langkah berikut merupakan alur manual yang tercatat dalam pengembangan Ujianix. Pastikan berada di direktori build yang berisi `config/`.

### 5.1 Persiapan konfigurasi dan izin

```bash
sudo mkdir -p config/includes.chroot_after_packages/etc/ujianix .build
sudo touch .build/config
sudo chown -R root:root config
sudo chmod 440 config/includes.chroot_after_packages/etc/sudoers.d/ujianix-installer
sudo chmod 755 config/includes.chroot_after_packages/usr/local/bin/* config/includes.chroot_after_packages/usr/local/sbin/* config/hooks/live/*
```

> Perintah `chmod` di atas mengasumsikan file dan direktori yang disebut tersedia. Jika ada path yang tidak ditemukan, periksa struktur repository sebelum melanjutkan.

### 5.2 Jalankan build

```bash
sudo lb build 2>&1 | tee build.log
```

Proses ini dapat berlangsung cukup lama. Pantau log `build.log` dan tunggu hingga proses selesai. Jangan menganggap ISO berhasil dibuat hanya karena sebagian tahap build telah berjalan.

### 5.3 Kembalikan kepemilikan file konfigurasi

Setelah build manual selesai, kembalikan kepemilikan direktori konfigurasi kepada pengguna yang menjalankan build:

```bash
sudo chown -R "$USER:$USER" config
```

## 6. Build ulang

Jika perlu mengulang build manual, bersihkan artefak build terlebih dahulu:

```bash
sudo lb clean
```

Kemudian ulangi persiapan konfigurasi dan izin, serta perintah build pada bagian sebelumnya.

Catatan: pada konfigurasi pengembangan Ujianix, setelah `lb clean`, direktori `.build/config` perlu dibuat kembali:

```bash
mkdir -p .build
touch .build/config
```

Jangan menjalankan `lb config` tanpa memahami dampaknya terhadap konfigurasi yang ada. Proses konfigurasi live-build dapat mengubah atau mengembalikan sejumlah nilai ke pengaturan bawaan.

## 7. Pemeriksaan hasil build

Setelah proses build selesai, periksa apakah ISO telah dihasilkan. Nama file dapat berbeda mengikuti konfigurasi dan versi.

Contoh pemeriksaan:

```bash
ls -lh live-image-amd64.hybrid.iso
sha256sum live-image-amd64.hybrid.iso
```

- `ls -lh` memeriksa keberadaan dan ukuran ISO.
- `sha256sum` menghasilkan checksum untuk pemeriksaan integritas dan pencatatan artefak.

Simpan checksum bersama ISO atau catatan rilis. Ukuran ISO dan performa harus dicatat berdasarkan hasil aktual, bukan target.

## 8. Pengujian ISO

ISO yang berhasil dibuat belum berarti semua fitur berhasil. Lakukan pengujian, setidaknya:

- Boot menu dan pemilihan Try Ujianix.
- Boot menu dan pemilihan Install Ujianix.
- Alur konfigurasi administrator.
- Browser kiosk dan akses ke halaman ujian.
- Installer dan hasil instalasi.
- Fitur pengawasan jika diaktifkan pada build yang diuji.
- Perangkat, jaringan, dan firmware yang relevan.

Catat versi ISO, lingkungan pengujian, hasil aktual, serta bukti. Rujuk dokumentasi pengujian sistem untuk daftar skenario.

## 9. Troubleshooting build

| Gejala | Pemeriksaan awal |
|---|---|
| Build berhenti atau gagal | Periksa pesan error dan bagian akhir `build.log`. |
| Paket tidak ditemukan | Periksa koneksi, mirror Debian, nama paket, dan daftar paket. |
| Skrip hook gagal | Periksa isi hook, sintaks, izin executable, dan log build. |
| Izin file bermasalah | Periksa kepemilikan dan izin pada `config/`. |
| Build ulang tidak berjalan dengan benar | Jalankan pembersihan yang sesuai, buat kembali `.build/config` jika diperlukan, lalu ulangi prosedur. |
| ISO tidak ditemukan | Periksa status build, log, dan nama artefak yang dihasilkan konfigurasi. |

## 10. Catatan

- Prosedur build dapat berubah mengikuti versi Ujianix dan konfigurasi live-build.
- Jangan mengubah alur boot resmi tanpa mencatat perubahan dan mengujinya.
- Fitur keamanan tidak boleh dianggap aktif hanya karena konfigurasi atau skripnya tersedia.
- Hasil build perlu diuji pada lingkungan yang sesuai sebelum digunakan dalam pelaksanaan ujian.
- Versi paket, ukuran ISO, waktu build, waktu boot, dan penggunaan RAM sebaiknya dicatat pada dokumentasi benchmark.

