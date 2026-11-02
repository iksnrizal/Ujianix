# Ujianix

Ujianix adalah distro Linux khusus ujian yang dirancang ringan, dapat dijalankan melalui Live USB maupun dipasang ke disk, serta menyediakan lingkungan ujian dengan mode kiosk.

## Tujuan

- Menyediakan lingkungan ujian yang membatasi akses peserta ke sistem.
- Mendukung penggunaan server ujian online maupun server lokal (offline).
- Membatasi koneksi jaringan berdasarkan whitelist yang disiapkan admin.
- Mengirim jawaban ke server, bukan menyimpannya secara permanen di perangkat peserta.
- Menyediakan mekanisme pengawasan visual sesuai konfigurasi dan pemberitahuan privasi.

Ujianix bertujuan mempersulit dan membantu mendeteksi kecurangan di sisi komputer peserta. Ujianix tidak menjamin kecurangan mustahil dilakukan; kecurangan di luar komputer peserta berada di luar jangkauan perangkat lunak.

## Status proyek

Repository ini merupakan repository pengembangan aktif tim. Pada awal pengembangan ulang, dokumentasi dan pembagian alur kerja sedang disiapkan. ISO belum berhasil dibangun dan diuji boot pada tahap ini.

## Rancangan dan dokumentasi

- [Rancangan proyek](docs/01-rancangan-proyek.md)
- [Alur pengerjaan](docs/02-alur-pengerjaan.md)
- [Pembagian tugas](docs/03-pembagian-tugas.md)
- [Keputusan teknis](docs/04-keputusan-teknis.md)
- [Rencana pengujian](docs/05-pengujian/test-plan.md)

## Persyaratan sasaran

- Arsitektur: x86_64 (64-bit).
- Basis: Debian minimal; versi stabil ditetapkan dan diverifikasi pada tahap prototipe.
- RAM minimum sasaran: 1 GB.
- Ukuran ISO sasaran: 600 MB–1 GB.
- Mode penggunaan: Live USB dan instalasi ke disk dengan kemampuan setara.

Angka dan sasaran di atas adalah target rancangan, bukan hasil pengujian yang sudah tercapai.

## Kontribusi

Kontribusi dilakukan melalui branch terpisah dan Pull Request. Jangan melakukan commit langsung ke `main` kecuali telah disepakati oleh pengelola repository.

## Tim

Nama, NPM, dan pembagian peran final akan ditambahkan setelah disepakati seluruh anggota.

## Lisensi

Rancangan proyek menetapkan GPL. Jenis/versi lisensi yang akan digunakan perlu ditetapkan sebelum file lisensi ditambahkan.
