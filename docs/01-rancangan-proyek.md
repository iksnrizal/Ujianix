# Rancangan Proyek Ujianix

**Status:** Ringkasan dari Dokumen Rancangan Ujianix versi 0.1.  
**Catatan:** Bagian yang belum diputuskan tetap ditandai sebagai terbuka.

## 1. Visi dan tujuan

Ujianix adalah distro Linux khusus ujian yang sangat ringan, dapat dijalankan sebagai Live USB maupun dipasang ke disk, dan dirancang untuk mempersulit serta mendeteksi kecurangan di sisi komputer peserta.

Tujuan terukur dalam rancangan:
- ISO dapat di-boot dan di-install dengan ukuran sasaran 600 MB sampai 1 GB.
- Berjalan pada perangkat lama dengan RAM minimal sasaran 1 GB dan CPU 64-bit.
- Peserta hanya dapat membuka lingkungan ujian (mode kiosk).
- Jaringan dibatasi ke server ujian melalui whitelist.
- Jawaban tidak disimpan di perangkat peserta setelah ujian selesai.

**Batasan:** Ujianix tidak menjanjikan kecurangan mustahil dilakukan. Kecurangan di luar komputer, misalnya penggunaan HP kedua atau bantuan orang lain, berada di luar jangkauan perangkat lunak.

## 2. Sasaran pengguna dan peran

Pengguna utama adalah sekolah, dengan kemungkinan penggunaan di kampus, lembaga pelatihan, dan bimbingan belajar.

Tiga peran pengguna:
- Peserta: mengerjakan ujian.
- Pengawas: memantau peserta.
- Admin: menyiapkan USB, konfigurasi, dan server.

## 3. Keputusan utama rancangan

| Aspek | Keputusan rancangan |
|---|---|
| Mode soal | Hybrid: online dan offline melalui server lokal di laptop pengawas |
| Basis | Debian minimal; versi stabil ditetapkan saat prototipe |
| Arsitektur CPU | x86_64 / 64-bit |
| Ukuran ISO | 600 MB–1 GB |
| RAM minimal | 1 GB |
| Tampilan | Kiosk penuh |
| Anti-curang | Pembatasan sistem dan pengawasan visual (screen capture dan webcam) |
| Jaringan | Whitelist yang dikonfigurasi admin melalui file di USB |
| Data jawaban | Dikirim ke server, tidak disimpan lokal secara permanen |
| Mode penggunaan | Live USB dan install ke disk dengan kemampuan setara |
| Integritas | Root read-only, tanda tangan GPG, checksum, panduan BIOS; Secure Boot sebagai target opsional |
| Lisensi | GPL; versi lisensi belum ditentukan |

## 4. Arsitektur sistem

Ujianix dirancang terdiri dari tiga komponen:

1. **Image Ujianix:** ISO Live/instalasi berbasis Debian minimal yang memuat sistem terkunci dan browser kiosk.
2. **Server ujian:** server online milik institusi atau server lokal di laptop pengawas untuk mode offline.
3. **Layanan pengawas:** penerima screenshot/foto webcam dan log peserta; dapat berjalan pada server yang sama atau terpisah.

Aplikasi ujian yang akan digunakan masih terbuka. Rancangan menyebut LMS yang sudah ada atau aplikasi ujian sederhana sebagai kandidat untuk demo.

## 5. Alur kerja yang direncanakan

1. Admin menyiapkan USB dan berkas/partisi konfigurasi.
2. Perangkat peserta melakukan boot dari USB atau disk.
3. Sistem membaca konfigurasi admin, seperti mode, alamat server, whitelist, interval pengawasan, dan opsi webcam.
4. Firewall whitelist diterapkan sebelum antarmuka muncul.
5. Browser kiosk membuka halaman ujian.
6. Jawaban dan data pengawasan dikirim ke server sesuai rancangan.
7. Sesi ditutup; data sementara di RAM hilang saat perangkat dimatikan.

## 6. Privasi pengawasan

- Webcam dan screen capture direncanakan dapat diaktifkan/dimatikan oleh admin melalui konfigurasi.
- Peserta diberi pemberitahuan yang jelas sebelum ujian dimulai.
- Data pengawasan dikirim ke server pengawas, bukan disimpan pada perangkat peserta.
- Institusi pengguna bertanggung jawab atas penyimpanan dan penghapusan data pengawasan.

## 7. Status

Pada saat dokumen awal repository ini dibuat, ISO belum berhasil dibangun dan diuji boot. Semua sasaran di atas merupakan rancangan, bukan klaim fitur telah selesai.
