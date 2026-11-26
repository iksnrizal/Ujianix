# Panduan Instalasi dan Penggunaan UJIANIX

> **Status dokumen:** Panduan penggunaan berdasarkan rancangan dan catatan pengembangan UJIANIX. Beberapa fungsi pada ISO build ke-7 masih memerlukan pengujian langsung sebelum dinyatakan siap digunakan.

## 1. Tentang UJIANIX

UJIANIX adalah sistem operasi berbasis Debian 13 (Trixie) yang dirancang untuk mendukung pelaksanaan ujian berbasis komputer. Sistem menjalankan Firefox ESR dalam mode kiosk agar peserta diarahkan ke halaman ujian yang disediakan oleh institusi.

UJIANIX menyediakan sistem operasi dan lingkungan kiosk. Website atau aplikasi ujian tetap disediakan dan dikelola oleh institusi penyelenggara.

## 2. Persyaratan penggunaan

Persiapan yang diperlukan:

- File ISO UJIANIX.
- Komputer atau mesin virtual yang mendukung boot dari USB atau file ISO.
- Media USB bootable jika dipasang pada komputer fisik.
- Koneksi jaringan apabila halaman ujian atau server pengawas memerlukannya.
- URL halaman ujian yang disediakan institusi.

Untuk pengujian menggunakan VMware, ISO dapat dipasang sebagai CD/DVD virtual. Pengujian mode UEFI dan kebutuhan minimum perangkat masih perlu dibuktikan melalui pengujian tersendiri.

## 3. Menjalankan UJIANIX dalam mode Try

Mode **Try Ujianix** menjalankan sistem secara langsung dari media bootable tanpa memasang sistem ke penyimpanan internal.

Langkah-langkah:

1. Hubungkan USB bootable atau pasang ISO pada mesin virtual.
2. Nyalakan atau mulai ulang komputer.
3. Pilih media UJIANIX sebagai perangkat boot.
4. Pada menu boot UJIANIX, pilih **Try Ujianix**.
5. Tunggu hingga sistem live berjalan.
6. Sistem akan membuka Firefox ESR dalam tampilan kiosk dan menampilkan halaman awal UJIANIX.

Mode Try cocok untuk mencoba sistem tanpa melakukan instalasi permanen.

**Catatan:** Mode Try tidak menggunakan persistence. Perubahan konfigurasi pada sesi live tidak dipertahankan setelah komputer dimatikan.

## 4. Konfigurasi awal administrator

Pada penggunaan pertama, UJIANIX perlu dikonfigurasi melalui halaman setup lokal.

1. Ketika halaman setup ditampilkan, buat akun administrator pertama.
2. Gunakan kata sandi minimal 12 karakter.
3. Masukkan URL server atau halaman ujian yang diberikan institusi.
4. Isi pengaturan lain sesuai kebutuhan pelaksanaan ujian.
5. Simpan konfigurasi.
6. Pastikan halaman awal UJIANIX menampilkan status konfigurasi yang sesuai.

Kata sandi administrator disimpan dalam bentuk hasil derivasi PBKDF2-SHA256, bukan sebagai teks biasa. Berkas konfigurasi sistem berada di `/etc/ujianix/ujianix.conf`, sedangkan informasi autentikasi administrator disimpan terpisah di `/etc/ujianix/admin-auth`.

### Membuka pengaturan administrator

Untuk membuka pengaturan setelah konfigurasi awal:

1. Tekan tombol **F2** ketika layar splash UJIANIX ditampilkan.
2. Masuk menggunakan akun administrator.
3. Lakukan perubahan konfigurasi yang diperlukan.

Jangan membagikan kata sandi administrator kepada peserta ujian.

## 5. Memulai ujian

Setelah konfigurasi selesai:

1. Pastikan URL ujian telah diisi dengan benar.
2. Pastikan komputer terhubung ke jaringan yang diperlukan.
3. Pada halaman awal UJIANIX, lanjutkan ke halaman ujian.
4. Firefox ESR akan membuka halaman ujian dalam mode kiosk.
5. Peserta mengerjakan ujian melalui aplikasi atau website milik institusi.

UJIANIX tidak menyediakan bank soal, sistem penilaian, ataupun aplikasi ujian. Seluruh fungsi tersebut menjadi tanggung jawab platform ujian institusi.

## 6. Persetujuan privasi dan fitur pengawasan

UJIANIX memiliki prototipe fitur pengawasan visual yang dapat menggunakan:

- Screenshot layar melalui `grim`.
- Pengambilan gambar webcam melalui `fswebcam`.

Jika fitur pengawasan diaktifkan, halaman pemberitahuan privasi ditampilkan sebelum pengambilan gambar dimulai. Peserta harus menekan tombol **Saya mengerti** sebagai tanda telah membaca pemberitahuan tersebut.

Setelah persetujuan diberikan, agen pengawasan dapat mengambil gambar sesuai pengaturan interval dan mengirimkannya ke server pengawas terpisah melalui jaringan.

### Hal yang perlu diperhatikan

- Pengawasan bersifat opsional dan bergantung pada konfigurasi.
- Pengambilan gambar tidak dimulai sebelum persetujuan diberikan.
- Gambar dikirim ke server pengawas, bukan disimpan sebagai arsip lokal peserta menurut rancangan sistem.
- Komputer pengawas harus menjalankan program server pengawas.
- Pada VMware, mode jaringan **Bridged** diperlukan agar mesin virtual dapat menjangkau komputer pengawas pada jaringan yang sama.
- Webcam perlu dihubungkan ke mesin virtual melalui menu perangkat VMware.

**Status:** Fitur pengawasan masih berstatus prototipe dalam catatan pengembangan. Pengiriman screenshot, webcam, pemulihan koneksi, dan tampilan galeri harus diuji kembali pada ISO yang akan digunakan. Jangan menganggap fitur ini telah tervalidasi hanya berdasarkan keberadaan komponennya.

## 7. Memasang UJIANIX ke komputer

Mode **Install Ujianix** digunakan untuk memasang sistem ke penyimpanan komputer.

> **Peringatan:** Proses instalasi dan pengaturan partisi dapat mengubah atau menghapus data pada penyimpanan yang dipilih. Cadangkan data penting dan pastikan disk tujuan sudah benar sebelum melanjutkan.

Langkah-langkah umum:

1. Boot komputer menggunakan media UJIANIX.
2. Pada menu boot, pilih **Install Ujianix**.
3. Tunggu hingga Calamares, yaitu installer UJIANIX, terbuka.
4. Ikuti halaman sambutan.
5. Pilih disk dan pengaturan partisi dengan teliti.
6. Buat akun pengguna sesuai kebutuhan.
7. Periksa ringkasan instalasi sebelum menyetujui proses.
8. Jalankan instalasi dan tunggu sampai selesai.
9. Setelah proses selesai, mulai ulang komputer sesuai petunjuk installer.
10. Lepaskan media boot jika diminta agar komputer memulai sistem dari penyimpanan internal.

Installer dirancang menggunakan bahasa Indonesia, locale `id_ID`, zona waktu `Asia/Jakarta`, dan tata letak keyboard US. Halaman pemilihan lokasi dan papan ketik tidak ditampilkan karena pengaturan tersebut ditanam saat proses build.

## 8. Penggunaan setelah instalasi

Setelah UJIANIX terpasang:

1. Nyalakan komputer dari penyimpanan internal.
2. Tunggu hingga sistem masuk ke lingkungan kiosk.
3. Selesaikan konfigurasi administrator apabila diminta.
4. Pastikan URL ujian dan pengaturan jaringan sudah benar.
5. Jalankan halaman ujian melalui halaman awal UJIANIX.

Berbeda dengan mode Try, konfigurasi administrator pada sistem terpasang disimpan secara permanen di `/etc/ujianix`.

Akun peserta dirancang agar tidak menjadi anggota grup `sudo`. Status hak akses akun dan penguncian akun root tetap perlu diverifikasi pada hasil build final.

## 9. Menjalankan server pengawas

Server pengawas merupakan program terpisah yang dijalankan pada komputer pengawas berbasis Windows.

Berdasarkan struktur proyek, program tersedia pada:

`tools/pengawas/ujianix-pengawas.py`

File batch pendamping:

`tools/pengawas/jalankan-pengawas.bat`

Catatan pengembangan mencantumkan cara menjalankan server melalui Python:

```powershell
py ujianix-pengawas.py 8000
```

Perintah tersebut dijalankan dari direktori tempat file server berada. Setelah server aktif, alamat server pengawas perlu dimasukkan ke konfigurasi UJIANIX apabila fitur pengawasan digunakan.

**Catatan keamanan:** Penggunaan server pengawas pada catatan pengembangan masih memiliki keterbatasan, termasuk asumsi jaringan tepercaya. Gunakan hanya pada lingkungan uji yang dikelola dan jangan mempublikasikan server ke jaringan yang tidak dipercaya.

## 10. Batasan yang perlu diketahui

- UJIANIX membantu membatasi lingkungan ujian dan mendukung pengawasan, tetapi tidak menjamin seluruh bentuk kecurangan dapat dicegah.
- Website atau aplikasi ujian disediakan oleh institusi, bukan oleh UJIANIX.
- Mode Try tidak menyimpan perubahan setelah komputer dimatikan.
- Fitur pengawasan masih memerlukan pengujian menyeluruh.
- Firewall whitelist, pembatasan konsol teks, penguncian parameter boot, kebijakan Firefox kiosk, dan pembatasan USB tercatat sebagai pekerjaan pengamanan yang belum selesai pada dokumen serah-terima.
- Pengujian boot UEFI, benchmark performa, serta verifikasi kebutuhan minimum perangkat masih diperlukan.
- Jangan menggunakan ISO untuk ujian sungguhan sebelum seluruh pengujian dan pengamanan yang diwajibkan institusi selesai.

## 11. Pemecahan masalah awal

| Masalah | Pemeriksaan awal |
|---|---|
| Halaman ujian tidak terbuka | Periksa URL ujian dan koneksi jaringan. |
| Halaman setup muncul kembali | Periksa apakah konfigurasi administrator telah disimpan. |
| Tombol F2 tidak membuka pengaturan | Pastikan tombol ditekan ketika layar splash sedang ditampilkan. |
| Pengawasan tidak mengirim gambar | Periksa persetujuan privasi, alamat server, koneksi jaringan, dan status server pengawas. |
| Webcam tidak terdeteksi di VMware | Periksa apakah webcam sudah dihubungkan ke mesin virtual melalui menu Removable Devices. |
| Sistem live kehilangan konfigurasi setelah restart | Hal ini sesuai dengan mode Try yang tidak menggunakan persistence. |
| Installer tidak dapat melanjutkan | Periksa disk tujuan, ruang penyimpanan, dan pesan kesalahan Calamares. |

Jika masalah tetap terjadi, catat pesan kesalahan dan ambil tangkapan layar untuk proses pemeriksaan. Hindari mengubah partisi atau berkas sistem tanpa memahami dampaknya.

## 12. Penutup

Panduan ini menjelaskan alur dasar menjalankan, mengonfigurasi, menggunakan, dan memasang UJIANIX. Sebelum digunakan pada pelaksanaan ujian sebenarnya, lakukan pengujian pada perangkat sasaran dan pastikan seluruh fitur keamanan, jaringan, instalasi, serta pengawasan telah diverifikasi.
