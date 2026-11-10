# Laporan QA Progress — Modul `network-config`

**Proyek:** Ujianix  
**Modul:** `network-config`  
**Branch sumber:** `feat/network-configuration`  
**Branch tujuan:** `initial/Nazuuralia`  
**Tanggal laporan:** 10 November 2026  
**Status:** Draft laporan progress (berdasarkan aktivitas Git yang dilaporkan)

## 1. Ringkasan Progress

Progress yang dilaporkan berfokus pada pemindahan folder `network-config` dari branch `feat/network-configuration` ke branch `initial/Nazuuralia`.

Aktivitas yang direncanakan/dibahas:
1. Berpindah ke branch tujuan `initial/Nazuuralia`.
2. Mengambil folder `network-config` dari branch sumber `feat/network-configuration`.
3. Memeriksa perubahan melalui `git status` dan isi folder.
4. Melakukan commit perubahan.
5. Melakukan push branch tujuan ke remote jika diperlukan.

> **Catatan status:** Percakapan menunjukkan instruksi pemindahan folder, tetapi belum memuat bukti bahwa seluruh langkah telah dijalankan. Karena itu, laporan ini tidak menyatakan proses copy, commit, atau push telah berhasil.

## 2. Ruang Lingkup QA

Pemeriksaan QA yang relevan untuk progress ini:

- Memastikan branch aktif adalah `initial/Nazuuralia`.
- Memastikan folder `network-config` tersedia pada branch tujuan.
- Memastikan isi folder berasal dari branch `feat/network-configuration`.
- Memastikan tidak ada perubahan tak terduga pada file lain.
- Memastikan perubahan tercatat dalam commit.
- Memastikan push berhasil jika perubahan perlu tersedia di remote.

## 3. Checklist Verifikasi

| No. | Pemeriksaan | Perintah/Bukti | Status |
|---:|---|---|---|
| 1 | Branch tujuan aktif | `git branch --show-current` | Belum ada bukti |
| 2 | Folder tersedia di branch tujuan | `ls network-config` | Belum ada bukti |
| 3 | Perubahan terdeteksi | `git status` | Belum ada bukti |
| 4 | Isi folder sesuai branch sumber | Bandingkan dengan `feat/network-configuration` | Belum diverifikasi |
| 5 | Perubahan sudah di-commit | `git log -1 --oneline` | Belum ada bukti |
| 6 | Branch tujuan sudah di-push | `git push origin initial/Nazuuralia` dan cek remote | Belum ada bukti |

## 4. Prosedur Pemindahan Folder

Perintah yang digunakan untuk menyalin folder:

```bash
git switch initial/Nazuuralia
git restore --source feat/network-configuration -- network-config/
```

Setelah pemeriksaan, perubahan dapat dicatat dan dikirim:

```bash
git add network-config/
git commit -m "add network-config module"
git push origin initial/Nazuuralia
```

Perintah di atas merupakan prosedur, bukan bukti bahwa eksekusi telah berhasil.

## 5. Hasil QA Sementara

**Kesimpulan sementara: Belum dapat dinyatakan lulus QA.**

Alasannya:
- Belum tersedia output terminal yang membuktikan folder berhasil disalin.
- Belum tersedia hasil pemeriksaan isi folder.
- Belum tersedia bukti commit maupun push.

QA dapat diperbarui menjadi **Lulus** setelah checklist verifikasi dilengkapi dan tidak ditemukan masalah.

## 6. Bukti yang Perlu Dilampirkan

Untuk melengkapi laporan, kumpulkan:
- Output `git branch --show-current`.
- Output `git status`.
- Daftar file dari `ls network-config`.
- Output `git diff --stat` atau pemeriksaan perbandingan folder.
- Hash/identitas commit dari `git log -1 --oneline`.
- Bukti branch remote setelah push, bila dilakukan.

## 7. Catatan

Laporan ini hanya mencakup progress pemindahan folder `network-config` antarbranch. Laporan ini **tidak menilai fungsi konfigurasi jaringan, firewall whitelist, mode online/offline, atau validasi konfigurasi**, karena belum ada bukti implementasi dan hasil pengujian modul tersebut.

---
*Disusun sebagai laporan QA progress sementara berdasarkan informasi aktivitas Git yang tersedia.*
