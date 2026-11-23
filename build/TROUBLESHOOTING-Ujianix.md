# Troubleshooting Ujianix

Dokumen ini berisi pemeriksaan awal untuk membantu mengidentifikasi masalah saat menggunakan, menguji, atau membangun Ujianix. Langkah di bawah merupakan panduan diagnostik umum; tidak semua solusi telah diuji pada setiap konfigurasi Ujianix.

## 1. ISO tidak dapat boot

**Gejala:** ISO tidak memulai sistem, berhenti di layar boot, atau kembali ke menu firmware.

- Pastikan file ISO selesai diunduh atau dibuat dan tidak rusak.
- Jika tersedia, bandingkan checksum ISO dengan checksum yang diterbitkan oleh sumber pembuatnya.
- Buat ulang media USB menggunakan aplikasi penulis image yang sesuai.
- Periksa pengaturan firmware seperti Secure Boot, mode boot UEFI/Legacy, serta urutan boot. Pengaturan yang diperlukan dapat berbeda menurut perangkat.
- Coba boot ISO di mesin virtual untuk membantu membedakan masalah ISO dan perangkat fisik.

## 2. Kiosk browser tidak berjalan

**Gejala:** Firefox tidak terbuka otomatis, layar kiosk kosong, atau browser berhenti.

- Periksa apakah sistem sudah menyelesaikan proses boot dan sesi grafis telah berjalan.
- Periksa log sesi atau layanan yang menginisiasi browser. Nama unit dapat berbeda pada tiap konfigurasi:

  ```bash
  journalctl -b --no-pager
  systemctl --user --failed
  ```

- Jika browser dijalankan oleh skrip autostart atau unit systemd, periksa konfigurasi, path executable, izin file, dan log unit terkait.
- Coba jalankan browser secara manual dari terminal untuk melihat pesan kesalahan, bila akses terminal tersedia.
- Periksa konektivitas dan alamat situs ujian yang digunakan.

## 3. Konfigurasi administrator tidak dapat dibuka

**Gejala:** Menu, skrip, atau aplikasi konfigurasi administrator tidak merespons atau gagal dijalankan.

- Pastikan konfigurasi atau skrip yang dimaksud tersedia pada ISO atau sistem yang terpasang.
- Periksa izin eksekusi dan kepemilikan file jika konfigurasi berbentuk skrip.
- Jalankan dari terminal jika memungkinkan untuk memperoleh pesan kesalahan.
- Periksa log sistem:

  ```bash
  journalctl -b --no-pager
  ```

- Pastikan tindakan yang membutuhkan hak administrator dijalankan dengan mekanisme otorisasi yang sesuai.

## 4. Calamares gagal menjalankan instalasi

**Gejala:** Instalasi gagal, berhenti di langkah tertentu, atau muncul pesan kesalahan.

- Catat pesan kesalahan dan langkah instalasi tempat kegagalan terjadi.
- Periksa apakah disk tujuan terdeteksi dan memiliki ruang yang cukup.
- Pastikan konfigurasi installer dan modul yang dibutuhkan tersedia.
- Periksa log Calamares dan log sistem. Lokasi log dapat berbeda menurut versi dan konfigurasi; periksa dokumentasi paket atau pesan installer.
- Jangan menghapus atau memformat disk sebelum memastikan disk tujuan dan cadangan data.

## 5. Webcam tidak terdeteksi

**Gejala:** Webcam tidak muncul atau aplikasi pengawasan tidak dapat mengambil gambar.

- Periksa koneksi webcam USB dan coba port lain bila menggunakan perangkat eksternal.
- Periksa apakah perangkat terdeteksi:

  ```bash
  lsusb
  dmesg | tail -n 50
  ```

- Periksa perangkat video yang tersedia:

  ```bash
  ls -l /dev/video*
  ```

- Pastikan aplikasi yang digunakan memiliki akses ke perangkat video dan tidak sedang digunakan aplikasi lain.
- Jika perangkat tidak terdeteksi, uji webcam pada sistem lain untuk membantu mengidentifikasi masalah perangkat keras.

## 6. Screenshot atau data pengawasan tidak terkirim

**Gejala:** Screenshot tidak dibuat, tidak tersimpan, atau tidak sampai ke server.

- Periksa apakah proses pengambilan screenshot berjalan dan apakah file dihasilkan.
- Periksa izin direktori penyimpanan sementara dan lokasi output.
- Periksa konektivitas ke server serta alamat dan port tujuan yang dikonfigurasi.
- Periksa log aplikasi atau skrip pengawasan untuk pesan kesalahan.
- Jika menggunakan endpoint HTTP, lakukan pemeriksaan koneksi secara hati-hati, misalnya:

  ```bash
  curl -v http://ALAMAT-SERVER/
  ```

  Ganti `ALAMAT-SERVER` dengan alamat server yang benar. Perintah ini hanya menguji koneksi ke endpoint yang dituju; endpoint dan metode pengiriman sebenarnya mungkin berbeda.
- Pastikan mekanisme pengiriman, format data, dan autentikasi sesuai konfigurasi server.

## 7. Server monitoring tidak dapat dijangkau

**Gejala:** Sistem klien tidak dapat menghubungi server atau data tidak diterima.

- Periksa konfigurasi alamat IP dan jaringan pada klien serta server:

  ```bash
  ip addr
  ip route
  ```

- Periksa apakah server aktif dan mendengarkan pada port yang dikonfigurasi.
- Periksa firewall, aturan jaringan, dan pembatasan akses.
- Gunakan `ping` jika ICMP diizinkan pada jaringan tersebut:

  ```bash
  ping ALAMAT-SERVER
  ```

- Gunakan pemeriksaan endpoint yang sesuai, misalnya `curl`, jika server menyediakan endpoint HTTP.
- Periksa log server dan klien untuk menemukan penyebab kegagalan.

## 8. Akses jaringan atau situs ujian bermasalah

**Gejala:** Situs ujian tidak dapat dibuka atau akses jaringan terbatas tidak berfungsi seperti yang diharapkan.

- Periksa status koneksi dan konfigurasi DNS.
- Periksa alamat situs ujian dan apakah situs tersebut dapat diakses dari jaringan yang digunakan.
- Periksa konfigurasi whitelist atau aturan akses jaringan yang diterapkan.
- Periksa log firewall atau proxy, jika tersedia.
- Pastikan aturan yang diterapkan tidak memblokir layanan yang diperlukan untuk menjalankan ujian.

## 9. Build ISO gagal

**Gejala:** Proses build berhenti dengan error atau file ISO tidak dihasilkan.

- Baca pesan kesalahan terakhir dan identifikasi tahap build yang gagal.
- Pastikan lingkungan build memenuhi persyaratan dan dependensi tersedia.
- Periksa konfigurasi live-build, file paket, skrip hook, dan izin file.
- Pastikan ruang disk dan memori yang tersedia cukup untuk proses build.
- Jika kegagalan terjadi setelah perubahan konfigurasi, periksa kembali perubahan terakhir.
- Jalankan proses build dengan output log yang dapat ditinjau. Opsi perintah build dapat berbeda tergantung skrip yang digunakan.

## 10. Pemeriksaan awal umum

Sebelum mengubah konfigurasi atau mengulang instalasi, lakukan langkah berikut:

1. Catat gejala, waktu kejadian, dan tahap proses saat masalah muncul.
2. Catat pesan error yang terlihat.
3. Periksa log sistem atau log aplikasi yang relevan.
4. Identifikasi perubahan terakhir pada konfigurasi, paket, perangkat, atau jaringan.
5. Uji satu perubahan pada satu waktu agar penyebab masalah lebih mudah ditemukan.
6. Hindari menghapus data, mengubah partisi, atau mengubah konfigurasi keamanan sebelum memahami dampaknya.

## 11. Melaporkan masalah

Saat melaporkan masalah Ujianix, sertakan informasi yang tidak sensitif:

- Versi Ujianix atau ISO yang digunakan.
- Perangkat dan lingkungan pengujian (perangkat fisik atau virtual).
- Langkah untuk mereproduksi masalah.
- Pesan kesalahan atau potongan log yang relevan.
- Perubahan konfigurasi yang dilakukan sebelum masalah muncul.

Jangan sertakan kata sandi, token, data pribadi peserta, atau screenshot yang memuat informasi sensitif.

---

Panduan ini merupakan langkah pemeriksaan awal, bukan jaminan bahwa setiap masalah dapat diselesaikan. Hasil diagnostik dapat berbeda bergantung pada perangkat, konfigurasi, jaringan, dan versi komponen yang digunakan.
