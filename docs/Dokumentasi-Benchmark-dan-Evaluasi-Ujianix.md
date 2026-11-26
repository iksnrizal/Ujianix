# Dokumentasi Benchmark dan Evaluasi Sistem Ujianix

> **Status dokumen:** Kerangka pengukuran — hasil benchmark belum diisi.  
> **Versi sistem yang menjadi acuan:** Ujianix build v7; build v8 direncanakan untuk finalisasi sistem pengawasan.  
> **Tanggal pembaruan:** 23 November 2026

## 1. Tujuan

Dokumen ini digunakan untuk mencatat hasil pengukuran performa Ujianix secara terukur dan dapat diulang. Benchmark diperlukan untuk mengetahui kebutuhan sumber daya, waktu proses boot, serta kelayakan Ujianix dijalankan pada perangkat dengan spesifikasi terbatas.

Dokumen ini juga menjadi dasar evaluasi apakah target ukuran ISO dan kebutuhan RAM yang direncanakan telah tercapai. Angka hasil pengukuran tidak boleh diisi berdasarkan perkiraan.

## 2. Ruang Lingkup Pengukuran

Pengukuran yang direncanakan meliputi:

1. Ukuran berkas ISO.
2. Waktu boot sampai tampilan awal Ujianix siap digunakan.
3. Penggunaan RAM ketika sistem berada dalam kondisi idle.
4. Penggunaan RAM ketika browser kiosk menjalankan halaman ujian.
5. Penggunaan RAM ketika fitur pengawasan diaktifkan (jika build dan pengujian pengawasan telah berhasil).
6. Penggunaan CPU ketika idle dan ketika menjalankan skenario ujian.
7. Pengamatan kestabilan sistem selama sesi pengujian.

Pengukuran performa tidak menggantikan pengujian fungsional maupun pengujian keamanan.

## 3. Target dan Kriteria Evaluasi

Target berikut merupakan sasaran proyek, bukan hasil yang sudah terbukti.

| Metrik | Target / kriteria | Status |
|---|---|---|
| Ukuran ISO | 600 MB–1 GB | Menunggu pengukuran ISO final |
| RAM minimum | Sasaran pengujian 1 GB | Belum dibuktikan |
| Waktu boot | Dicatat dan dievaluasi; belum ada batas numerik yang disepakati | Belum diukur |
| RAM idle | Dicatat dalam MB | Belum diukur |
| RAM saat ujian | Dicatat dalam MB | Belum diukur |
| RAM saat pengawasan aktif | Dicatat dalam MB jika fitur pengawasan lolos uji | Belum diukur |
| Stabilitas sesi | Tidak mengalami hang atau crash selama durasi uji yang dicatat | Belum diuji melalui benchmark |

## 4. Lingkungan Pengujian

Setiap pengujian harus mencatat lingkungan yang digunakan agar hasil dapat dibandingkan.

| Komponen | Nilai pengujian |
|---|---|
| Versi/build Ujianix | [Isi build yang diuji] |
| Nama berkas ISO | [Isi nama ISO] |
| SHA-256 ISO | [Isi checksum] |
| Platform | VMware Workstation / perangkat fisik |
| Mode firmware | BIOS / UEFI |
| CPU yang dialokasikan | [Isi jumlah core/vCPU dan model jika diketahui] |
| RAM yang dialokasikan | [Isi kapasitas] |
| Kapasitas disk virtual | [Isi kapasitas] |
| Jaringan | NAT / Bridged / tidak digunakan |
| Perangkat webcam | [Tidak digunakan / model perangkat] |
| Tanggal dan waktu pengujian | [Isi tanggal dan waktu] |
| Penguji | [Isi nama/inisial] |

**Catatan:** Pengujian build v7 yang telah dilaporkan sebelumnya menggunakan VMware Workstation dalam mode BIOS. Jumlah CPU dan RAM VM pada catatan serah-terima belum tersedia. Jangan menganggap pengujian tersebut sebagai benchmark terukur.

## 5. Metode Pengujian

### 5.1 Pengukuran ukuran ISO

1. Tentukan berkas ISO yang benar-benar akan diuji atau dirilis.
2. Catat ukuran berkas dalam MB atau GB.
3. Hitung checksum SHA-256.
4. Simpan nama berkas, ukuran, checksum, dan versi build pada tabel hasil.

Contoh perintah pada Linux:

```bash
ls -lh ujianix.iso
sha256sum ujianix.iso
```

Gunakan nama berkas ISO yang sesuai dengan berkas sebenarnya.

### 5.2 Pengukuran waktu boot

1. Matikan VM atau perangkat uji sepenuhnya.
2. Mulai pengukuran ketika proses boot dimulai.
3. Hentikan pengukuran ketika tampilan awal Ujianix telah siap digunakan dan dapat menerima interaksi.
4. Catat hasil dalam detik.
5. Ulangi minimal tiga kali pada konfigurasi yang sama.
6. Hitung rata-rata dari percobaan yang berhasil dan catat setiap kegagalan secara terpisah.

Definisi titik akhir harus konsisten pada setiap percobaan. Jangan mencampur waktu sampai menu boot dengan waktu sampai browser kiosk siap.

| Percobaan | Waktu boot (detik) | Catatan |
|---|---:|---|
| 1 | — | Belum diukur |
| 2 | — | Belum diukur |
| 3 | — | Belum diukur |
| Rata-rata | — | Diisi setelah pengukuran |

### 5.3 Pengukuran RAM dan CPU

Pengukuran dilakukan setidaknya pada dua kondisi:

- **Idle:** sistem sudah masuk ke tampilan awal dan tidak sedang membuka halaman ujian.
- **Saat ujian:** browser kiosk sudah membuka halaman ujian uji yang sama pada setiap percobaan.

Jika fitur pengawasan sudah dinyatakan lolos pengujian fungsional, tambahkan kondisi ketiga: **saat ujian dengan pengawasan aktif**.

Pada terminal sistem Ujianix, perintah berikut dapat digunakan untuk mengambil gambaran penggunaan memori dan CPU:

```bash
free -h
```

```bash
top
```

Jika `top` tidak tersedia atau hasilnya sulit dicatat, gunakan alat pemantauan sistem lain yang tersedia dan tuliskan nama alat serta cara pengukurannya. Catat nilai yang sama jenisnya pada semua percobaan, misalnya penggunaan RAM `used` dari `free -h`. Jangan membandingkan nilai `available` pada satu pengujian dengan `used` pada pengujian lain.

| Kondisi | RAM terpakai | RAM tersedia | CPU (%) | Catatan |
|---|---:|---:|---:|---|
| Idle | — | — | — | Belum diukur |
| Browser kiosk aktif | — | — | — | Belum diukur |
| Kiosk + pengawasan aktif | — | — | — | Menunggu pengawasan teruji |

### 5.4 Pengujian pada RAM 1 GB

1. Atur VM menggunakan RAM 1 GB.
2. Catat jumlah CPU, firmware, disk, dan konfigurasi VM lainnya.
3. Boot ISO dari kondisi mati.
4. Periksa apakah sistem berhasil masuk ke tampilan awal.
5. Jalankan skenario ujian yang sama.
6. Catat gejala seperti proses lambat, aplikasi gagal dibuka, hang, atau sistem berhenti merespons.
7. Ulangi pengujian dan simpan bukti.

Jika sistem gagal boot atau tidak dapat menyelesaikan skenario, catat sebagai hasil gagal. Jangan mengubah konfigurasi di tengah rangkaian percobaan tanpa membuat catatan pengujian baru.

## 6. Tabel Rekapitulasi Hasil

Bagian ini diisi setelah pengujian benar-benar dilakukan.

| No. | Pengujian | Hasil aktual | Status | Bukti |
|---:|---|---|---|---|
| 1 | Ukuran ISO final | Belum diukur | Belum diuji | — |
| 2 | Checksum ISO final | Belum dicatat | Belum diuji | — |
| 3 | Waktu boot | Belum diukur | Belum diuji | — |
| 4 | RAM saat idle | Belum diukur | Belum diuji | — |
| 5 | RAM saat browser kiosk aktif | Belum diukur | Belum diuji | — |
| 6 | RAM saat pengawasan aktif | Belum diukur | Menunggu pengawasan teruji | — |
| 7 | Penggunaan CPU | Belum diukur | Belum diuji | — |
| 8 | Uji VM dengan RAM 1 GB | Belum dilakukan | Belum diuji | — |
| 9 | Stabilitas sesi | Belum diuji | Belum diuji | — |

## 7. Evaluasi

Evaluasi akhir dilakukan setelah tabel hasil diisi. Gunakan pertanyaan berikut sebagai panduan:

- Apakah ukuran ISO berada dalam rentang target proyek?
- Apakah Ujianix dapat boot dan menjalankan skenario ujian pada VM dengan RAM 1 GB?
- Berapa perbedaan penggunaan RAM antara kondisi idle dan saat browser kiosk aktif?
- Apakah aktivasi pengawasan menambah penggunaan RAM atau CPU secara berarti?
- Apakah waktu boot konsisten pada pengulangan?
- Apakah ditemukan hang, crash, atau kendala yang memengaruhi pelaksanaan ujian?

Tuliskan kesimpulan berdasarkan angka dan bukti yang terkumpul. Jika suatu skenario belum diuji, nyatakan sebagai belum diuji, bukan berhasil.

## 8. Keterbatasan dan Hal yang Perlu Diperhatikan

1. Catatan proyek yang tersedia menyebut ISO build v7 berukuran 752 MB. Angka tersebut adalah ukuran build v7 yang tercatat, bukan ukuran ISO final rilis.
2. Target RAM minimum 1 GB masih harus dibuktikan melalui pengujian.
3. Waktu boot sebelumnya dikeluhkan lambat, tetapi penyebabnya belum dipastikan dan belum tersedia hasil pengukuran `systemd-analyze`.
4. Pengawasan build v8 memerlukan pengujian langsung pada VM, termasuk ketersediaan sesi grafis dan kamera. Hasil uji di lingkungan pengembangan tidak menggantikan pengujian pada VM target.
5. Hasil benchmark dipengaruhi konfigurasi host, hypervisor, firmware, jumlah CPU, media penyimpanan, dan kondisi jaringan. Karena itu, spesifikasi lingkungan wajib dicatat.
6. Benchmark tidak membuktikan keamanan sistem. Status firewall whitelist, penguncian parameter boot, pembatasan konsol, kebijakan Firefox, dan pembatasan USB harus didokumentasikan melalui pengujian keamanan tersendiri.

## 9. Bukti yang Harus Dilampirkan

- Screenshot atau keluaran terminal ukuran ISO.
- Keluaran perintah SHA-256.
- Catatan waktu setiap percobaan boot.
- Screenshot `free -h` pada kondisi idle dan saat ujian.
- Screenshot atau catatan pemantauan CPU.
- Screenshot konfigurasi spesifikasi VM.
- Rekaman atau screenshot ketika pengujian RAM 1 GB dilakukan.
- Catatan kegagalan atau anomali, jika ada.

Gunakan nama berkas bukti yang konsisten, misalnya:

```text
docs/
└── benchmark/
    ├── iso-size-and-checksum.png
    ├── vm-specification.png
    ├── boot-time-results.png
    ├── memory-idle.png
    ├── memory-exam.png
    └── memory-supervision.png
```

Nama di atas merupakan saran struktur penyimpanan; buat hanya berkas bukti yang benar-benar tersedia.

## 10. Kesimpulan Sementara

Pada saat dokumen ini dibuat, data benchmark final Ujianix belum tersedia dalam catatan proyek. Build v7 tercatat memiliki ukuran ISO 752 MB, tetapi waktu boot, penggunaan RAM, penggunaan CPU, dan kelayakan pada VM dengan RAM 1 GB belum memiliki hasil pengukuran yang dapat dijadikan kesimpulan.

Dengan demikian, dokumen ini berfungsi sebagai prosedur dan lembar pencatatan benchmark. Kesimpulan performa final harus diperbarui setelah build yang akan dirilis diuji pada lingkungan yang spesifikasinya dicatat.

---

## Riwayat Perubahan

| Versi | Tanggal | Perubahan |
|---|---|---|
| 1.0 | 23 November 2026 | Membuat kerangka dokumentasi benchmark dan evaluasi; hasil pengukuran menunggu pengujian aktual. |
