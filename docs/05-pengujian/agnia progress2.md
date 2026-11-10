# Laporan Pengujian (QA) - Ujianix
**Tahap:** Tahap 5 — Server dan Pengawasan
**Tanggal Pengujian:** 10 November 2026
**Pelaksana Uji:** Pengembang Pengawasan dan Server (Peran 5)
**Lingkungan Uji:** Mesin Virtual (Ubuntu di VirtualBox)

---

## 1. Komponen yang Diuji
Prototipe layanan pengawasan hybrid telah dikembangkan dan diuji coba, meliputi:
1. `konfigurasi_admin.conf`: Simulasi pembacaan aturan (interval dan status fitur).
2. `server_ujianix.py`: Layanan *backend* Flask (berjalan di `0.0.0.0:5000`) penerima jawaban dan file media.
3. `klien_ujianix.sh`: Skrip sisi peserta untuk notifikasi privasi, penangkapan layar (`scrot`), foto webcam (`fswebcam`), dan pengiriman data (`curl`).

---

## 2. Hasil Uji Fungsional & Anti-Curang

Sesuai dengan **Rencana Pengujian Ujianix**, berikut adalah hasil dari eksekusi yang telah dilakukan:

| ID | Skenario | Hasil yang Diharapkan | Hasil Aktual | Status |
| :--- | :--- | :--- | :--- | :--- |
| **F-05** | **Mode online:** Peserta dapat terhubung ke server ujian online. | Data terkirim ke server dengan alamat IP tujuan yang disimulasikan. | Klien berhasil melakukan HTTP POST. Log server menunjukkan respons HTTP `200 OK`. | **Lulus** |
| **F-06** | **Mode offline:** Peserta dapat terhubung ke server lokal pengawas. | Data terkirim ke server lokal (misal laptop pengawas). | Skrip mengarah ke `127.0.0.1` dan berhasil diterima oleh layanan Flask. | **Lulus** |
| **Privasi** | Memastikan pemberitahuan privasi dijelaskan sebelum ujian. | *Pop-up* muncul dan meminta peserta membaca notifikasi. | Jendela `zenity` berhasil menampilkan peringatan privasi yang harus ditutup peserta sebelum *looping* pengawasan dimulai. | **Lulus** |
| **Data** | Data tidak disimpan permanen di perangkat peserta lokal. | Tidak ada jejak foto atau jawaban di perangkat peserta setelah dikirim. | Klien menggunakan `/tmp` (RAM) dan mengeksekusi `rm -f` tepat setelah *upload*. File terkonfirmasi hanya ada di *folder* server. | **Lulus** |

---

## 3. Bukti Pengujian
Pengujian tidak mengubah status menjadi "Lulus" tanpa bukti yang sah. Berikut adalah catatan bukti yang dilampirkan terpisah oleh pelaksana:

1. **Bukti Log Penerimaan:** Tangkapan layar terminal server (*Screenshot From 2026-11-10 13-58.png*) yang membuktikan masuknya data dengan kode status `200`.
2. **Bukti File Tersimpan di Server:** Hasil eksekusi dari perintah verifikasi direktori:
   - `ls -l data_pengawasan/12345678/` (Membuktikan *screenshot* dan foto *webcam* tersimpan di *folder* NPM peserta).
   - `ls -l data_jawaban/` (Membuktikan simulasi pengiriman jawaban JSON berhasil disalin).

---
*Catatan Tambahan: Proses instalasi dependensi sempat mengalami kendala repositori, namun berhasil diselesaikan menggunakan metode perbaikan `--fix-missing` sehingga pengujian dapat dilanjutkan.*