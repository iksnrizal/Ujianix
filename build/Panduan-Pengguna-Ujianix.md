# Panduan Pengguna Ujianix

> **Status dokumen:** Draf. Panduan ini disusun berdasarkan progres dan konteks teknis proyek yang tersedia. Cocokkan kembali nama menu, tampilan, serta alur aktual dengan ISO/build terbaru sebelum dokumen dijadikan panduan rilis.

## 1. Tentang Ujianix

Ujianix adalah distribusi Linux berbasis Debian 13 (Trixie) yang dikembangkan untuk mendukung pelaksanaan ujian melalui lingkungan kiosk. Sistem menggunakan Cage dan Firefox ESR untuk menjalankan halaman ujian, serta menyediakan backend konfigurasi dan komponen pengawasan peserta.

Panduan ini menjelaskan penggunaan Ujianix dari sisi operator/pengelola dan peserta. Pengaturan administratif sebaiknya diselesaikan oleh operator sebelum perangkat digunakan peserta.

## 2. Peran pengguna

### 2.1 Operator atau administrator

Operator bertanggung jawab untuk:

- Menyiapkan konfigurasi awal Ujianix.
- Menentukan alamat halaman ujian dan mode pelaksanaan.
- Mengatur opsi pengawasan yang memang digunakan.
- Memastikan layanan pengawasan tersedia apabila fitur tersebut diaktifkan.
- Memastikan perangkat siap sebelum peserta memulai ujian.

### 2.2 Peserta ujian

Peserta menggunakan perangkat yang telah disiapkan operator untuk membuka halaman ujian. Peserta mengikuti pemberitahuan privasi apabila fitur pengawasan diaktifkan, kemudian memulai sesi ujian melalui alur yang disediakan.

Peserta tidak perlu menggunakan akun administrator untuk mengerjakan ujian.

## 3. Persiapan sebelum penggunaan

Sebelum menyalakan perangkat, operator perlu memastikan:

1. ISO atau media USB Ujianix berasal dari build yang telah diuji.
2. Perangkat memenuhi kebutuhan minimum yang telah ditetapkan untuk pelaksanaan ujian.
3. Alamat situs ujian sudah benar dan dapat dijangkau.
4. Koneksi jaringan tersedia jika ujian atau pengawasan memerlukannya.
5. Komponen kamera tersedia dan dapat dikenali sistem jika pengawasan webcam diaktifkan.
6. Pengaturan pengawasan dan pemberitahuan privasi telah ditentukan sesuai kebijakan penyelenggara.

> Catatan: batas minimum perangkat, prosedur pemulihan, serta hasil pengujian kompatibilitas harus diisi berdasarkan hasil pengujian build rilis. Dokumen progres yang tersedia belum menetapkan seluruh angka dan hasil tersebut.

## 4. Menjalankan Ujianix dari media Live

1. Hubungkan USB atau media boot yang berisi Ujianix.
2. Nyalakan atau mulai ulang komputer.
3. Pilih media Ujianix melalui menu boot perangkat.
4. Pada menu boot Ujianix, pilih opsi **Try Ujianix** untuk menjalankan sesi Live.
5. Tunggu hingga lingkungan Ujianix selesai dimuat.

Opsi **Try Ujianix** digunakan untuk menjalankan sistem tanpa melakukan instalasi ke penyimpanan internal. Opsi **Install Ujianix** digunakan untuk memasang sistem ke perangkat dan bukan merupakan langkah untuk memulai sesi ujian Live.

**Penting:** sesi Live umumnya ditujukan untuk penggunaan sementara. Jangan mengandalkan sesi Live sebagai tempat penyimpanan permanen konfigurasi atau data. Perilaku persistensi harus dipastikan kembali pada build yang digunakan.

## 5. Konfigurasi awal oleh operator

Konfigurasi awal dilakukan sebelum perangkat diserahkan kepada peserta.

### 5.1 Membuka halaman setup

1. Jalankan Ujianix.
2. Buka halaman setup melalui rute `/setup` yang disediakan aplikasi konfigurasi.
3. Ikuti formulir pendaftaran administrator awal.
4. Buat kata sandi administrator yang kuat. Ketentuan implementasi yang tercatat menetapkan panjang minimum 12 karakter.
5. Lengkapi pengaturan awal yang tersedia, lalu simpan.

Rincian label dan susunan kolom formulir perlu disesuaikan dengan tampilan aktual pada build yang digunakan.

### 5.2 Pengaturan yang tersedia

Konfigurasi aplikasi yang tercatat mencakup:

| Pengaturan | Keterangan |
|---|---|
| Mode online/offline | Menentukan mode konektivitas pelaksanaan ujian sesuai dukungan aplikasi |
| URL ujian | Alamat halaman ujian yang akan dibuka |
| Whitelist | Daftar alamat yang diizinkan sesuai implementasi |
| Interval screenshot | Interval pengambilan screenshot jika fitur diaktifkan |
| Webcam | Pengaturan penggunaan webcam untuk pengawasan |
| Pemberitahuan privasi | Informasi kepada peserta terkait pengawasan |
| URL pengawas | Alamat server pengawasan yang digunakan jika fitur diaktifkan |

Tidak semua opsi harus diaktifkan pada setiap pelaksanaan. Operator perlu mengikuti kebijakan penyelenggara dan memastikan konfigurasi sesuai kebutuhan ujian.

### 5.3 Masuk ke dashboard administrator

1. Buka halaman login melalui rute `/login`.
2. Masukkan kredensial administrator yang telah dibuat.
3. Setelah berhasil masuk, halaman dashboard tersedia melalui rute `/dashboard`.
4. Periksa konfigurasi sebelum perangkat digunakan.
5. Simpan perubahan melalui mekanisme aplikasi, yang pada implementasi tercatat menggunakan rute `/save`.

Jangan membagikan kredensial administrator kepada peserta.

## 6. Alur peserta memulai ujian

Setelah operator menyelesaikan konfigurasi, peserta dapat menggunakan perangkat.

1. Nyalakan perangkat dan jalankan Ujianix.
2. Tunggu hingga halaman awal atau splash (`/splash`) tampil.
3. Ikuti instruksi yang ditampilkan oleh penyelenggara.
4. Sistem melanjutkan ke alur mulai ujian (`/start`) dan membuka halaman persiapan.
5. Jika pengawasan diaktifkan, baca pemberitahuan privasi yang ditampilkan.
6. Berikan persetujuan atau konfirmasi melalui alur pemberitahuan (`/ack`) sebelum proses pengawasan dimulai.
7. Lanjutkan melalui alur peluncuran (`/launch`) untuk membuka halaman ujian.

Nama tombol dan teks instruksi pada setiap halaman harus disamakan dengan tampilan aktual. Rute di atas merupakan rujukan implementasi, bukan jaminan bahwa alamat tersebut perlu diketik langsung oleh peserta.

## 7. Penggunaan fitur pengawasan

Fitur pengawasan dapat mencakup pengiriman screenshot dan penggunaan webcam sesuai konfigurasi. Fitur ini bersifat opsional dan hanya digunakan jika diaktifkan oleh operator.

Sebelum sesi dimulai, operator perlu:

- Menjalankan aplikasi/server pengawas.
- Memastikan perangkat Ujianix dapat menjangkau alamat server pengawas.
- Memastikan kamera terdeteksi dan izin/passthrough kamera tersedia jika webcam digunakan.
- Menyampaikan pemberitahuan privasi kepada peserta.
- Memastikan konfigurasi interval screenshot dan opsi webcam sesuai kebijakan penyelenggara.

### 7.1 Menjalankan server pengawas pada Windows

Dalam skenario pengujian yang tercatat, server pengawas dijalankan pada Windows menggunakan perintah:

```powershell
py ujianix-pengawas.py 8000
```

Perintah tersebut merupakan contoh dari lingkungan pengujian proyek. Pastikan dependensi, lokasi berkas, alamat IP server, dan port telah disesuaikan dengan instalasi aktual.

Untuk pengujian mesin virtual, catatan proyek menyebut penggunaan jaringan **Bridged** agar mesin Ujianix dapat berkomunikasi dengan server pada jaringan yang sama, serta pengaturan camera passthrough jika kamera VM digunakan.

### 7.2 Memeriksa hasil pengawasan

Pada prototipe server pengawas, pengujian mencakup tampilan galeri screenshot/webcam, indikator peserta aktif, peristiwa USB dan koneksi ulang, serta unduhan ZIP. Ketersediaan dan perilaku setiap fungsi harus diperiksa pada versi server yang benar-benar dipakai.

**Batasan keamanan:** konteks proyek mencatat bahwa prototipe monitoring belum memiliki autentikasi server dan mengasumsikan jaringan tepercaya. Karena itu, jangan menganggap prototipe tersebut telah aman untuk digunakan pada jaringan publik atau jaringan yang tidak tepercaya.

## 8. Memasang Ujianix ke perangkat

Jika Ujianix perlu dipasang secara permanen:

1. Boot perangkat menggunakan media Ujianix.
2. Pilih **Install Ujianix** dari menu boot.
3. Ikuti alur installer Calamares yang ditampilkan.
4. Periksa kembali pilihan instalasi sebelum menerapkan perubahan.
5. Tunggu hingga proses instalasi selesai.
6. Mulai ulang perangkat dan lepaskan media USB ketika diminta atau ketika perangkat mulai melakukan boot dari penyimpanan internal.

> **Peringatan:** proses instalasi sistem operasi dapat mengubah partisi atau data pada perangkat. Operator harus mencadangkan data penting dan memeriksa pilihan instalasi sebelum melanjutkan. Panduan ini tidak menetapkan pilihan partisi tertentu karena detail konfigurasi installer harus diverifikasi pada build aktual.

## 9. Pemecahan masalah dasar

| Masalah | Pemeriksaan awal |
|---|---|
| Ujianix tidak muncul dari USB | Periksa media boot, urutan boot perangkat, dan kompatibilitas mode boot BIOS/UEFI |
| Sistem berhenti saat proses boot | Catat pesan yang tampil, build ISO, dan spesifikasi perangkat; jangan langsung menyimpulkan penyebabnya |
| Halaman ujian tidak terbuka | Periksa URL ujian, mode online/offline, koneksi jaringan, dan konfigurasi whitelist |
| Server pengawas tidak menerima data | Periksa apakah server berjalan, alamat dan port yang dikonfigurasi, serta konektivitas jaringan |
| Webcam tidak terdeteksi | Periksa ketersediaan perangkat kamera dan konfigurasi passthrough jika memakai VM |
| Peserta tidak dapat melanjutkan setelah pemberitahuan privasi | Periksa konfigurasi monitoring dan alur konfirmasi pada build yang digunakan |
| Login administrator gagal | Pastikan kredensial benar; gunakan prosedur pemulihan resmi yang ditetapkan pengelola proyek |

Jika masalah tetap terjadi, kumpulkan informasi berikut untuk pelaporan: versi/build Ujianix, jenis perangkat atau VM, langkah sebelum masalah muncul, pesan kesalahan, dan log yang relevan. Jangan menyertakan kata sandi atau data pribadi peserta dalam laporan.

## 10. Praktik penggunaan yang disarankan

- Operator menyelesaikan konfigurasi dan pengujian sebelum hari ujian.
- Peserta menggunakan akun dan sesi yang telah disiapkan; kredensial administrator tidak dibagikan.
- URL ujian dan whitelist diperiksa sebelum sesi dimulai.
- Pengawasan hanya diaktifkan sesuai kebutuhan dan kebijakan penyelenggara.
- Peserta diberi informasi yang jelas tentang penggunaan screenshot atau webcam sebelum pengawasan dimulai.
- Hasil pengawasan disimpan dan diakses sesuai kebijakan retensi serta perlindungan data penyelenggara.
- Setelah ujian, operator mengikuti prosedur penutupan dan pengelolaan data yang berlaku.

## 11. Informasi yang perlu dilengkapi sebelum rilis

Daftar berikut harus diselesaikan melalui pengujian langsung dan dokumentasi visual:

- [ ] Screenshot menu boot Try/Install.
- [ ] Screenshot halaman setup administrator.
- [ ] Screenshot login dan dashboard administrator.
- [ ] Screenshot halaman splash, mulai ujian, dan pemberitahuan privasi.
- [ ] Screenshot halaman ujian dalam mode kiosk.
- [ ] Screenshot dashboard server pengawas.
- [ ] Langkah pemulihan resmi untuk lupa kata sandi administrator.
- [ ] Prosedur mematikan perangkat dan mengakhiri sesi ujian.
- [ ] Daftar perangkat dan periferal yang telah diuji.
- [ ] Hasil verifikasi apakah konfigurasi bertahan setelah reboot dan setelah instalasi.
- [ ] Prosedur pengelolaan, retensi, dan penghapusan data pengawasan.

## 12. Riwayat dokumen

| Versi | Keterangan |
|---|---|
| 0.1 | Draf awal panduan pengguna berdasarkan progres dan konteks teknis proyek Ujianix |

---

**Catatan untuk pengelola dokumentasi:** perbarui panduan ini setelah pengujian end-to-end pada ISO rilis. Hapus catatan draf dan lengkapi screenshot serta prosedur yang masih belum diverifikasi sebelum dipublikasikan sebagai panduan resmi.
