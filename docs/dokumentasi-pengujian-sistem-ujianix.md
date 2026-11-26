# Dokumentasi Pengujian Sistem UJIANIX

> **Status dokumen:** Rencana dan lembar pencatatan pengujian. Hasil pengujian harus diisi berdasarkan pelaksanaan nyata pada ISO yang diuji. Dokumen ini tidak menyatakan fitur telah lulus sebelum tersedia bukti.

## 1. Tujuan Pengujian

Dokumentasi ini digunakan untuk mencatat proses verifikasi sistem operasi UJIANIX, mulai dari proses boot, mode Try, installer, konfigurasi administrator, lingkungan kiosk, hingga fitur pengawasan.

Pengujian bertujuan untuk:
- Memastikan fungsi utama berjalan sesuai rancangan.
- Menemukan kesalahan atau perilaku yang tidak sesuai.
- Memastikan perubahan build tidak merusak fungsi yang sebelumnya berjalan.
- Menyediakan bukti pengujian untuk laporan proyek.

## 2. Lingkup Pengujian

Lingkup pengujian UJIANIX meliputi:

1. Boot dan menu pemilihan mode.
2. Mode Try Ujianix.
3. Konfigurasi administrator.
4. Browser kiosk dan akses halaman ujian.
5. Mode Install Ujianix dan hasil instalasi.
6. Pengawasan visual dan persetujuan privasi.
7. Komunikasi dengan server pengawas.
8. Pengujian kompatibilitas dan performa.
9. Pemeriksaan fitur keamanan.

## 3. Lingkungan Pengujian

Isi bagian ini setiap kali pengujian dilakukan agar hasil dapat direproduksi.

| Informasi | Isian |
|---|---|
| Versi/build ISO | [Isi versi build] |
| Nama file ISO | [Isi nama file] |
| SHA-256 ISO | [Isi checksum] |
| Tanggal pengujian | [Isi tanggal] |
| Perangkat/mesin virtual | [Isi perangkat atau VMware] |
| Prosesor | [Isi spesifikasi] |
| RAM | [Isi kapasitas] |
| Penyimpanan | [Isi kapasitas dan jenis] |
| Mode boot | [BIOS / UEFI] |
| Jaringan | [NAT / Bridged / lainnya] |
| Penguji | [Isi nama penguji] |

## 4. Kriteria Status Pengujian

Gunakan status berikut pada tabel hasil:

- **Lulus:** hasil sesuai dengan kriteria penerimaan dan memiliki bukti.
- **Gagal:** hasil tidak sesuai dengan kriteria penerimaan.
- **Belum diuji:** pengujian belum dilakukan.
- **Perlu perbaikan:** ditemukan masalah yang harus ditangani sebelum pengujian ulang.

Jangan mengubah status menjadi Lulus hanya karena komponen atau berkasnya tersedia.

## 5. Skenario Pengujian

### 5.1 Pengujian Boot dan Menu

| ID | Skenario | Langkah pengujian | Kriteria penerimaan | Status | Bukti/catatan |
|---|---|---|---|---|---|
| BOOT-01 | Boot dari ISO | Jalankan komputer atau VM dari ISO UJIANIX. | Sistem dapat memulai proses boot tanpa berhenti karena kesalahan. | Belum diuji | |
| BOOT-02 | Tampilan menu boot | Amati menu pemilihan mode. | Menu menampilkan pilihan Try Ujianix dan Install Ujianix. | Belum diuji | |
| BOOT-03 | Mode Try sebagai pilihan awal | Boot dan periksa pilihan yang aktif secara default. | Try Ujianix menjadi pilihan awal. | Belum diuji | |
| BOOT-04 | Pemilihan Install | Pilih Install Ujianix dari menu. | Sistem menjalankan installer Calamares. | Belum diuji | |
| BOOT-05 | Boot BIOS | Jalankan ISO pada mesin dengan mode BIOS. | ISO dapat melakukan boot pada mode BIOS. | Belum diuji | |
| BOOT-06 | Boot UEFI | Jalankan ISO pada mesin dengan mode UEFI. | ISO dapat melakukan boot pada mode UEFI. | Belum diuji | |

**Catatan status awal:** Catatan proyek menyebut menu Try/Install dan proses boot telah berhasil pada pengujian build sebelumnya. Build ke-7 masih perlu diuji ulang. Pengujian UEFI belum tercatat berhasil.

### 5.2 Pengujian Mode Try

| ID | Skenario | Langkah pengujian | Kriteria penerimaan | Status | Bukti/catatan |
|---|---|---|---|---|---|
| TRY-01 | Menjalankan mode live | Pilih Try Ujianix dan tunggu proses boot. | Sistem live berhasil dijalankan. | Belum diuji | |
| TRY-02 | Autologin | Amati proses setelah sistem live dimulai. | Sistem masuk ke sesi pengguna yang disiapkan tanpa meminta login manual. | Belum diuji | |
| TRY-03 | Menjalankan kiosk | Tunggu hingga lingkungan grafis terbuka. | Cage menjalankan Firefox ESR dalam mode kiosk. | Belum diuji | |
| TRY-04 | Menampilkan halaman splash | Amati halaman awal browser. | Halaman splash UJIANIX tampil. | Belum diuji | |
| TRY-05 | Konfigurasi awal | Jalankan setup ketika sistem belum dikonfigurasi. | Halaman setup administrator dapat dibuka. | Belum diuji | |
| TRY-06 | Perilaku tanpa persistence | Buat perubahan konfigurasi pada mode Try, lalu matikan dan boot kembali. | Perubahan sesi live tidak dianggap tersimpan permanen. | Belum diuji | |

### 5.3 Pengujian Konfigurasi Administrator

| ID | Skenario | Langkah pengujian | Kriteria penerimaan | Status | Bukti/catatan |
|---|---|---|---|---|---|
| ADM-01 | Pendaftaran administrator pertama | Buka setup dan isi data administrator. | Administrator pertama dapat didaftarkan. | Belum diuji | |
| ADM-02 | Validasi kata sandi | Coba kata sandi yang tidak memenuhi batas minimal, lalu coba kata sandi yang memenuhi. | Kata sandi di bawah 12 karakter ditolak; kata sandi sesuai ketentuan dapat diproses. | Belum diuji | |
| ADM-03 | Login administrator | Keluar dari halaman pengaturan dan lakukan login kembali. | Login dengan kredensial yang benar berhasil. | Belum diuji | |
| ADM-04 | Login dengan kredensial salah | Masukkan kredensial yang salah. | Akses ditolak. | Belum diuji | |
| ADM-05 | Membuka pengaturan dengan F2 | Tekan F2 saat layar splash tampil. | Halaman login/pengaturan administrator dapat diakses. | Belum diuji | |
| ADM-06 | Penyimpanan konfigurasi | Simpan konfigurasi dan periksa perilaku halaman setelah penyimpanan. | Konfigurasi diterapkan sesuai nilai yang dimasukkan. | Belum diuji | |

### 5.4 Pengujian Browser Kiosk dan Halaman Ujian

| ID | Skenario | Langkah pengujian | Kriteria penerimaan | Status | Bukti/catatan |
|---|---|---|---|---|---|
| KSK-01 | Membuka URL ujian | Masukkan URL ujian yang valid dan lanjutkan dari halaman splash. | Firefox membuka URL yang dikonfigurasi. | Belum diuji | |
| KSK-02 | Tampilan kiosk | Amati tampilan Firefox saat halaman ujian terbuka. | Browser berjalan dalam tampilan kiosk sesuai rancangan. | Belum diuji | |
| KSK-03 | Koneksi jaringan | Uji akses ke halaman ujian pada jaringan yang diperlukan. | Halaman dapat dijangkau jika jaringan dan server tersedia. | Belum diuji | |
| KSK-04 | URL tidak tersedia | Masukkan URL yang tidak dapat dijangkau. | Sistem menampilkan atau mempertahankan kondisi gagal akses tanpa menyatakan ujian berhasil dibuka. | Belum diuji | |

Kebijakan pembatasan tab, developer tools, akses file, dan fitur browser lainnya harus diuji setelah kebijakan Firefox kiosk diterapkan. Fitur tersebut belum boleh dinyatakan lulus berdasarkan rancangan saja.

### 5.5 Pengujian Installer

| ID | Skenario | Langkah pengujian | Kriteria penerimaan | Status | Bukti/catatan |
|---|---|---|---|---|---|
| INS-01 | Membuka Calamares | Pilih Install Ujianix dari menu boot. | Installer Calamares terbuka tanpa layar hitam. | Belum diuji | |
| INS-02 | Bahasa installer | Periksa bahasa antarmuka installer. | Antarmuka menggunakan bahasa Indonesia sesuai rancangan. | Belum diuji | |
| INS-03 | Halaman installer | Periksa urutan halaman yang ditampilkan. | Halaman berjalan sesuai urutan rancangan tanpa halaman Lokasi dan Papan Ketik yang disembunyikan. | Belum diuji | |
| INS-04 | Pemilihan disk dan partisi | Lakukan pemeriksaan pada disk uji yang tidak berisi data penting. | Disk tujuan dan ringkasan partisi dapat diperiksa sebelum instalasi. | Belum diuji | |
| INS-05 | Proses instalasi | Jalankan instalasi pada disk uji. | Proses instalasi selesai tanpa kesalahan yang menghentikan proses. | Belum diuji | |
| INS-06 | Boot sistem terpasang | Lepaskan ISO dan boot dari disk hasil instalasi. | Sistem UJIANIX terpasang dapat dimulai. | Belum diuji | |
| INS-07 | Konfigurasi setelah instalasi | Selesaikan setup administrator pada sistem terpasang. | Konfigurasi dapat digunakan setelah sistem dimulai ulang. | Belum diuji | |

**Peringatan:** Gunakan disk virtual atau perangkat uji yang datanya telah dicadangkan. Jangan melakukan pengujian partisi pada disk utama yang menyimpan data penting.

### 5.6 Pengujian Persetujuan Privasi dan Pengawasan

| ID | Skenario | Langkah pengujian | Kriteria penerimaan | Status | Bukti/catatan |
|---|---|---|---|---|---|
| MON-01 | Pemberitahuan privasi | Aktifkan fitur pengawasan dan mulai alur ujian. | Pemberitahuan privasi tampil sebelum pengambilan gambar. | Belum diuji | |
| MON-02 | Belum memberikan persetujuan | Jangan tekan tombol Saya mengerti. | Agen pengawasan belum memulai pengambilan gambar. | Belum diuji | |
| MON-03 | Memberikan persetujuan | Tekan tombol Saya mengerti. | Sistem mengizinkan alur pengawasan dimulai sesuai konfigurasi. | Belum diuji | |
| MON-04 | Screenshot | Aktifkan screenshot dan periksa penerimaan data pada server uji. | Server menerima data screenshot setelah persetujuan. | Belum diuji | |
| MON-05 | Webcam | Aktifkan webcam pada perangkat uji dan periksa server. | Server menerima gambar webcam setelah persetujuan jika perangkat tersedia. | Belum diuji | |
| MON-06 | Interval pengambilan gambar | Atur interval dan amati waktu penerimaan data. | Pengambilan gambar mengikuti interval yang dikonfigurasi. | Belum diuji | |
| MON-07 | Kegagalan kamera | Uji kondisi ketika kamera tidak tersedia. | Kegagalan dapat dikenali dan dicatat; sistem tidak melaporkan pengambilan berhasil jika gagal. | Belum diuji | |
| MON-08 | Pemulihan kamera | Pulihkan akses kamera setelah terjadi kegagalan. | Agen dapat kembali bekerja sesuai rancangan dan hasilnya tercatat. | Belum diuji | |

Pengujian pengawasan harus menggunakan perangkat uji dan peserta yang telah diberi informasi. Catat persetujuan, tujuan pengujian, jenis data yang dikirim, serta lokasi penyimpanan pada server uji.

### 5.7 Pengujian Server Pengawas dan Jaringan

| ID | Skenario | Langkah pengujian | Kriteria penerimaan | Status | Bukti/catatan |
|---|---|---|---|---|---|
| NET-01 | Menjalankan server pengawas | Jalankan program server pada komputer pengawas. | Server dapat dijalankan dan siap menerima koneksi. | Belum diuji | |
| NET-02 | Koneksi peserta ke server | Hubungkan perangkat UJIANIX dan server pada jaringan uji yang sama. | Perangkat UJIANIX dapat menjangkau server jika konfigurasi jaringan benar. | Belum diuji | |
| NET-03 | Penerimaan unggahan | Lakukan pengujian unggah dari perangkat UJIANIX. | Server menerima data yang dikirim. | Belum diuji | |
| NET-04 | Tampilan galeri | Buka halaman galeri server pengawas. | Data uji yang diterima dapat ditampilkan. | Belum diuji | |
| NET-05 | Koneksi terputus | Putuskan koneksi jaringan pada lingkungan uji. | Kondisi kegagalan koneksi dapat diketahui dan tidak dilaporkan sebagai unggahan sukses. | Belum diuji | |
| NET-06 | Koneksi pulih | Sambungkan kembali jaringan. | Perangkat dapat kembali berkomunikasi sesuai kemampuan implementasi. | Belum diuji | |
| NET-07 | Validasi akses server | Uji akses dengan token yang benar dan token yang salah jika mekanisme token tersedia pada build yang diuji. | Akses tanpa token yang sah ditolak sesuai implementasi. | Belum diuji | |

Catatan proyek menyebut mode jaringan Bridged pada VMware untuk menghubungkan mesin virtual dengan komputer pengawas pada jaringan yang sama. Hasil pengujian harus mencantumkan mode jaringan yang digunakan.

### 5.8 Pengujian Keamanan

| ID | Area | Pemeriksaan | Kriteria penerimaan | Status | Bukti/catatan |
|---|---|---|---|---|---|
| SEC-01 | Hak akses peserta | Periksa keanggotaan grup akun peserta. | Akun peserta tidak memiliki hak sudo. | Belum diuji | |
| SEC-02 | Akun root | Periksa kebijakan akun root pada sistem terpasang. | Status akun root sesuai kebijakan keamanan yang ditetapkan. | Belum diuji | |
| SEC-03 | Firewall whitelist | Periksa aturan firewall dan uji koneksi yang diizinkan serta ditolak. | Hanya tujuan jaringan yang diizinkan dapat diakses sesuai kebijakan. | Belum diuji | |
| SEC-04 | Konsol teks | Periksa akses ke konsol teks melalui kombinasi tombol terminal. | Akses konsol dibatasi sesuai rancangan keamanan. | Belum diuji | |
| SEC-05 | Parameter boot | Periksa apakah parameter boot dapat diubah oleh pengguna tanpa otorisasi. | Perubahan parameter boot dibatasi sesuai rancangan keamanan. | Belum diuji | |
| SEC-06 | Kebijakan Firefox | Periksa pembatasan tab, developer tools, dan akses file. | Pembatasan yang ditetapkan benar-benar berlaku. | Belum diuji | |
| SEC-07 | Perangkat USB | Uji kebijakan penggunaan USB pada perangkat uji. | Pembatasan USB berjalan sesuai kebijakan yang ditetapkan. | Belum diuji | |
| SEC-08 | Debug sementara | Periksa apakah blok debug pengembangan masih ada pada image final. | Tidak ada blok debug sementara yang tertinggal pada image rilis. | Belum diuji | |

**Penting:** Catatan serah-terima proyek menyatakan firewall whitelist, penutupan konsol teks, penguncian parameter boot, kebijakan Firefox kiosk, pembatasan USB, dan penghapusan blok debug masih merupakan pekerjaan yang belum selesai. Karena itu, skenario terkait harus tetap berstatus Belum diuji atau Perlu perbaikan sampai implementasi dan verifikasi dilakukan.

### 5.9 Pengujian Performa dan Kompatibilitas

| ID | Parameter | Metode pengujian | Data yang dicatat | Status |
|---|---|---|---|---|
| PERF-01 | Ukuran ISO | Periksa ukuran file ISO final. | Ukuran dalam MB/GB. | Belum diuji |
| PERF-02 | Waktu boot | Ukur dari pemilihan menu boot sampai halaman kiosk siap digunakan. | Durasi dalam detik. | Belum diuji |
| PERF-03 | Penggunaan RAM idle | Catat penggunaan RAM ketika sistem berada pada halaman awal. | RAM dalam MB/GB. | Belum diuji |
| PERF-04 | Penggunaan RAM saat ujian | Catat penggunaan RAM ketika browser membuka halaman ujian uji. | RAM dalam MB/GB. | Belum diuji |
| PERF-05 | Kompatibilitas BIOS | Jalankan ISO pada perangkat/VM BIOS. | Berhasil atau gagal, spesifikasi perangkat. | Belum diuji |
| PERF-06 | Kompatibilitas UEFI | Jalankan ISO pada perangkat/VM UEFI. | Berhasil atau gagal, spesifikasi perangkat. | Belum diuji |
| PERF-07 | Kompatibilitas perangkat | Uji resolusi layar, keyboard, jaringan, dan webcam. | Perangkat yang terdeteksi dan kendala. | Belum diuji |

Target ukuran ISO 600 MB–1 GB dan RAM minimal 1 GB merupakan target proyek yang harus dibuktikan melalui pengukuran. Jangan menuliskannya sebagai hasil aktual sebelum pengujian dilakukan.

## 6. Rekapitulasi Hasil Pengujian

Isi rekapitulasi setelah skenario pengujian dilaksanakan.

| Kategori | Jumlah lulus | Jumlah gagal | Belum diuji | Catatan |
|---|---:|---:|---:|---|
| Boot dan menu | 0 | 0 | 6 | |
| Mode Try | 0 | 0 | 6 | |
| Administrator | 0 | 0 | 6 | |
| Browser kiosk | 0 | 0 | 4 | |
| Installer | 0 | 0 | 7 | |
| Privasi dan pengawasan | 0 | 0 | 8 | |
| Server pengawas dan jaringan | 0 | 0 | 7 | |
| Keamanan | 0 | 0 | 8 | |
| Performa dan kompatibilitas | 0 | 0 | 7 | |

Angka pada tabel merupakan nilai awal sebelum pengujian dilakukan. Perbarui jumlah berdasarkan status aktual pada tabel skenario.

## 7. Dokumentasi Bukti Pengujian

Untuk setiap pengujian, simpan bukti yang relevan, misalnya:

- Screenshot menu boot.
- Screenshot halaman splash dan kiosk.
- Screenshot halaman setup dan dashboard administrator.
- Screenshot installer dan ringkasan instalasi.
- Screenshot sistem setelah instalasi.
- Screenshot pemberitahuan privasi.
- Screenshot galeri server pengawas yang berisi data uji.
- Catatan terminal atau log ketika terjadi kesalahan.
- Hasil pengukuran ukuran ISO, waktu boot, dan penggunaan RAM.

Gunakan penamaan bukti yang konsisten, misalnya:

```text
bukti-pengujian/
├── boot/
├── try-mode/
├── administrator/
├── kiosk/
├── installer/
├── pengawasan/
├── keamanan/
└── performa/
```

Jangan memasukkan kata sandi, token, data pribadi peserta, atau gambar yang tidak diperlukan ke dalam bukti publik repositori.

## 8. Format Catatan Pengujian

Gunakan format berikut untuk mencatat setiap pengujian yang dilakukan.

```text
ID Pengujian:
Nama Pengujian:
Tanggal:
Versi ISO:
Lingkungan Pengujian:
Langkah Pengujian:
Hasil yang Diharapkan:
Hasil Aktual:
Status: Lulus / Gagal / Belum diuji / Perlu perbaikan
Lokasi Bukti:
Catatan:
```

## 9. Kesimpulan

Dokumentasi ini menjadi acuan untuk memeriksa kesiapan UJIANIX sebelum digunakan. Setiap fitur harus diuji pada ISO dan lingkungan yang dicatat. Hasil pengujian harus disertai bukti agar status keberhasilan dapat dipertanggungjawabkan.

Pengujian pada build sebelumnya tidak otomatis membuktikan bahwa build terbaru memiliki hasil yang sama. Setiap perubahan build perlu diuji ulang pada bagian yang terdampak.
