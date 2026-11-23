# Sumber dan Lisensi Komponen Ujianix

Dokumen ini mencatat komponen perangkat lunak yang digunakan atau direncanakan dalam Ujianix, fungsi masing-masing komponen, serta lokasi untuk memeriksa informasi lisensi dan sumber resmi.

> **Catatan verifikasi:** versi, paket yang benar-benar disertakan pada ISO, dan lisensi setiap komponen beserta dependensinya perlu diverifikasi dari konfigurasi repository, paket build, serta metadata paket yang digunakan. Daftar berikut merupakan daftar komponen yang tercatat dalam dokumentasi pengembangan, bukan inventaris final ISO.

## Komponen

| Komponen | Fungsi dalam Ujianix | Sumber resmi | Informasi lisensi |
|---|---|---|---|
| Debian 13 (Trixie) | Basis distribusi Linux | https://www.debian.org/ | Debian terdiri dari banyak paket dengan lisensi masing-masing. Periksa metadata paket. |
| Linux kernel | Kernel sistem operasi | https://www.kernel.org/ | Kernel Linux umumnya GPL-2.0-only; periksa dokumentasi dan komponen terkait. |
| live-build | Perangkat untuk membangun sistem live Debian | https://live-team.pages.debian.net/live-manual/ | Periksa lisensi paket live-build yang dipasang. |
| Cage | Kiosk compositor berbasis Wayland | https://github.com/cage-kiosk/cage | Periksa LICENSE pada versi yang digunakan. |
| Firefox ESR | Browser untuk lingkungan ujian | https://www.mozilla.org/firefox/enterprise/ | Periksa informasi lisensi dan distribusi Mozilla untuk versi yang digunakan. |
| Calamares | Installer sistem | https://calamares.io/ | Periksa LICENSE dan paket yang digunakan. |
| systemd | Pengelolaan layanan dan sistem | https://systemd.io/ | Periksa lisensi proyek dan paket distribusi. |
| Python | Bahasa/runtime untuk skrip dan layanan | https://www.python.org/ | Python menggunakan lisensi PSF; periksa versi yang digunakan. |
| grim | Utilitas screenshot Wayland | https://sr.ht/~emersion/grim | Periksa lisensi pada versi paket yang digunakan. |
| fswebcam | Utilitas pengambilan gambar webcam | https://github.com/fswebcam/fswebcam | Periksa lisensi pada versi paket yang digunakan. |

## Memverifikasi paket yang benar-benar terpasang

Pada lingkungan Debian yang digunakan untuk build atau pengujian, periksa paket yang terpasang:

```bash
dpkg-query -W -f='${Package}\t${Version}\t${Status}\n' | grep 'install ok installed'
```

Untuk mengetahui metadata paket tertentu:

```bash
apt show nama-paket
```

Periksa juga informasi copyright dan lisensi yang disediakan paket, biasanya pada:

```text
/usr/share/doc/nama-paket/copyright
```

Nama paket dan lokasi file dapat berbeda. Gunakan metadata dari paket versi yang benar-benar disertakan.

## Sumber distribusi dan kewajiban lisensi

Ujianix menggabungkan komponen dari distribusi Debian dan proyek perangkat lunak lainnya. Setiap komponen dapat memiliki lisensi, kewajiban atribusi, pemberitahuan copyright, serta ketentuan redistribusi yang berbeda.

Sebelum mendistribusikan ISO:

1. Inventarisasi paket yang benar-benar disertakan.
2. Periksa metadata copyright dan lisensi masing-masing paket.
3. Pertahankan pemberitahuan copyright dan lisensi yang diwajibkan.
4. Periksa ketentuan redistribusi komponen dan perubahan yang dilakukan.
5. Pastikan lisensi proyek Ujianix tidak diklaim menggantikan lisensi komponen pihak ketiga.
6. Dokumentasikan sumber serta versi komponen yang digunakan pada rilis.

## Lisensi Ujianix

Lisensi repository Ujianix sendiri belum dinyatakan dalam dokumen ini. Lisensi proyek harus ditentukan secara terpisah, lalu file `LICENSE` ditambahkan ke repository setelah kewajiban distribusi dan kompatibilitas lisensi diperiksa.

---

Daftar ini perlu diperbarui saat komponen, versi paket, atau konfigurasi ISO berubah.
