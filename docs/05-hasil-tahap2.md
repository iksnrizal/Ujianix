# Laporan QA Tahap 2 — Prototipe Dasar ISO Ujianix
**Tanggal pengujian:** 10, 12, dan 13 November 2026 (build 3, build 4, dan build 5)
**Penguji / Pelaksana Build:** Muhammad Mufti Faried (NPM: 257006111070)
**Status tahap:** Baseline ISO berhasil dibangun dan di-boot di mesin virtual. Benchmark (waktu boot, RAM) dan checksum sudah dicatat; lihat bagian 5 dan 6.

> Aturan proyek: keberhasilan tidak boleh diklaim tanpa bukti. Kolom yang bertanda **BELUM DIISI** harus dilengkapi dari hasil pengujian nyata, bukan perkiraan.

---

## 1. Lingkungan pengujian

| Komponen | Nilai |
|---|---|
| Host | Ubuntu 26.04.1 LTS (Resolute Raccoon), kernel 7.0.0-38-generic |
| RAM host | ±11 GiB |
| Alat build | live-build 20250814 (dari repositori git `salsa.debian.org/live-team/live-build`, commit `531cdb985`, tanggal 2026-09-13) |
| Catatan versi | `dpkg` masih melaporkan paket `3.0~a57-1ubuntu54`; paket di-`apt-mark hold` |
| Target | Debian 13 (trixie), amd64 |
| Hipervisor | QEMU/KVM |
| Perintah boot UEFI | `qemu-system-x86_64 -m 1024 -smp 1 -enable-kvm -bios /usr/share/ovmf/OVMF.fd -cdrom live-image-amd64.hybrid.iso -boot d` |
| Kernel di ISO | linux 6.12.116-1 (6.12.116+deb13-amd64) |
| live-boot / live-config | 1:20250815~deb13u1 / 11.0.5 |

Konfigurasi `lb config` yang dipakai:

```
--mode debian --distribution trixie --architectures amd64
--binary-images iso-hybrid --bootloaders "syslinux,grub-efi"
--debian-installer none --apt-recommends false --archive-areas "main"
--iso-volume "UJIANIX" --iso-application "Ujianix"
--bootappend-live "boot=live components quiet noroot"
```

Daftar paket (`build/config/package-lists/ujianix.list.chroot`), versi akhir:

```
live-boot
live-config
live-config-systemd
systemd-sysv
linux-image-amd64
login
passwd
sudo
libpam-systemd
libpam-modules
dbus
user-setup
locales
keyboard-configuration
```

## 2. Ringkasan build

| Build | Perubahan | Hasil | Ukuran |
|---|---|---|---|
| 1 | Paket minimal (`linux-image-amd64`, `live-boot`, `live-config`, `systemd-sysv`) | `Build completed successfully` | 334 MB (171008 sektor) |
| 2 | Tambah `login`, `passwd`, `sudo`, `libpam-systemd`, `libpam-modules`, `dbus`; jalankan dengan `< /dev/null` | `Build completed successfully` (13:49) | ±337 MiB (172544 sektor); squashfs 271,79 MiB |
| 3 | Tambah `user-setup`, `locales`, `keyboard-configuration` | Berhasil, boot dan autologin terkonfirmasi lewat tangkapan layar | 344 MiB |
| 4 | Parameter `noroot` pada bootappend-live (hardening: sudo dihapus) | `Build completed successfully`; boot dan autologin terkonfirmasi | 344 MiB (176128 sektor); squashfs 279,09 MiB |

Ukuran ISO jauh di bawah sasaran 600 MB–1 GB karena belum ada browser dan kiosk. Ini wajar untuk baseline, bukan kegagalan.
## 3. Hasil uji fungsional

| ID | Skenario | Hasil yang diharapkan | Hasil aktual | Status |
|---|---|---|---|---|
| T2-01 | `lb build` sampai selesai | ISO terbentuk | ISO terbentuk di build 1, 2, 3 | LULUS |
| T2-02 | Boot ISO lewat UEFI (OVMF) | Menu GRUB muncul | Menu "Live system (amd64)" tampil | LULUS |
| T2-03 | Boot ISO lewat BIOS lama (ISOLINUX) | Menu syslinux muncul | `Failed to load COM32 file vesamenu.c32`; menu tidak tampil, prompt `boot:` masih berfungsi | GAGAL SEBAGIAN (lihat T-02) |
| T2-04 | Autologin pada build 2 | Masuk shell `user` | `Authentication failure` berulang di tty1 | GAGAL (lihat T-01) |
| T2-05 | Autologin pada build 3 | Masuk shell `user` | Prompt `user@debian:~$` muncul, kernel 6.12.116+deb13-amd64 | LULUS |
| T2-06 | Boot dengan RAM 1 GB (`-m 1024`) | Sistem naik | Naik sampai shell | LULUS |
| T2-07a | `whoami`, `id`, `sudo -n true` (build 3) | user, grup sudo, sudo tanpa password | Grup sudo (27) ada; `sudo -n true` berhasil | LULUS (sebelum hardening) |
| T2-07b | Pengujian yang sama pada build 4 (`noroot`) | user tanpa grup sudo, sudo ditolak | `id` tanpa grup sudo; `sudo -n true`: "a password is required"; `sudo poweroff`: "user is not in the sudoers file" | LULUS (hardening berhasil) |
| T2-08 | Waktu boot (build 4) | Tercatat 3 kali | 6,903 s; 6,941 s; 6,898 s. Rata-rata 6,914 s (build 3: 8,858 s) | LULUS (tercatat) |
| T2-09 | Pemakaian RAM (build 4) | Tercatat 3 kali | used 256, 258, 258 MiB; available 704, 702, 702 MiB | LULUS (tercatat) |
| T2-10 | Checksum ISO (`sha256sum`) | Tercatat | Tercatat di bagian 6 | LULUS (tercatat) |
| T2-11 | Boot di perangkat fisik (flash USB) | Boot berhasil | Belum dicoba | BELUM DIUJI |
| T2-12 | Secure Boot | Opsional, setelah fitur inti | Belum diuji. Log build menyebut "UEFI Secure Boot support enabled", tetapi itu belum bukti boot dengan Secure Boot aktif | DI LUAR LINGKUP TAHAP INI |

## 4. Temuan (defect log)
	
### T-01 — Autologin gagal ketika `LB_APT_RECOMMENDS="false"` (tinggi, sudah diperbaiki)

- **Gejala:** tty1 menampilkan `user (automatic login)` lalu `Authentication failure`, berulang karena getty di-restart.
- **Dugaan penyebab:** paket `user-setup`, `locales`, `keyboard-configuration` hanya berstatus *Recommended* untuk `live-config`, sehingga tidak terpasang ketika Recommends dimatikan. Di log build 2 ketiganya hanya muncul di daftar "Recommended packages".
- **Perbaikan:** menambahkan ketiga paket secara eksplisit ke package list (build 3).
- **Verifikasi:** setelah perbaikan, autologin berhasil. Catatan jujur: penyebab pasti belum dibuktikan langsung (`getent passwd user` di VM), karena percobaan `init=/bin/bash` gagal (lihat T-04). Bukti yang ada adalah korelasi: gejala hilang setelah paket ditambahkan. Update: pada build 3, `getent passwd user` menampilkan akun "Debian Live user", sehingga akun terbukti ada (kondisi build 2 saat gagal tidak diperiksa langsung).
- **Saran lanjutan:** tambahkan uji regresi `getent passwd user` dan login manual di tty2 pada setiap build ISO.

### T-02 — Menu ISOLINUX gagal pada boot BIOS (sedang, belum diperbaiki)

- **Gejala:** `Failed to load COM32 file vesamenu.c32`, hanya prompt `boot:` yang tersedia.
- **Dugaan:** modul `vesamenu.c32` tidak tersalin ke ISO karena `syslinux-common` dipasang lalu dihapus pada tahap pembersihan build (tampak di log `lb binary_syslinux`).
- **Dampak:** peserta pada perangkat BIOS lama tidak melihat menu; sistem masih bisa di-boot manual. Relevan karena sasaran proyek adalah perangkat lama.
- **Hasil cek:** `xorriso -find /isolinux -name '*.c32'` menunjukkan `vesamenu.c32` tidak ada di ISO (yang ada: hdt, ldlinux, libcom32, libgpl, libmenu, libutil). Dugaan penyebab di atas belum diverifikasi.
- **Tindak lanjut:** diputuskan pada Tahap 3/6 (bootloader akan diatur sendiri untuk kiosk). Perlu uji ulang jalur BIOS setelah konfigurasi bootloader final.

### T-03 — Proses `lb build` macet di tahap chroot (sedang, ada solusi)

- **Gejala:** build berhenti di `Reading package lists...` tanpa kemajuan; terdapat proses berstatus `T` (stopped).
- **Solusi yang dipakai:** menjalankan `sudo lb build < /dev/null 2>&1 | tee build.log` agar apt tidak menunggu input terminal.
- **Catatan:** dicatat sebagai prosedur build standar untuk tim.

### T-04 — Layar korup saat boot dengan `init=/bin/bash` (rendah, tidak dikejar)

- **Gejala:** jendela QEMU menampilkan sampah warna-warni setelah `init=/bin/bash` ditambahkan di baris `linux` GRUB (jalur UEFI/OVMF).
- **Dugaan:** konsol grafis tidak diinisialisasi karena proses boot dipotong. Belum diselidiki lebih jauh.
	- **Dampak:** hanya menghambat metode debug tertentu, bukan fungsi ISO. Jalur debug alternatif: login manual di tty2.

### T-05 — Paket tak diminta ikut terpasang (rendah, ditunda ke Tahap 3)

- **Gejala:** `indi-dsi`, `libindi-data`, `libindidriver1`, `firmware-ath9k-htc`, `firmware-carl9170`, `firmware-linux-free`, `wireless-regdb` ikut terpasang walaupun Recommends dimatikan.
- **Dugaan:** berasal dari dependensi `linux-image-amd64`/mekanisme firmware live-build, bukan Recommends. Belum diverifikasi (misalnya dengan `apt-cache rdepends` atau `apt-get -s install`).
- **Dampak:** menambah ukuran ISO dan permukaan serangan. Perlu dirapikan pada tahap kiosk.
- **Update build 4:** paket-paket ini dikonfirmasi masih terpasang (log tahap chroot_install-packages).

### T-06 — Pesan yang aman diabaikan (informasi)

- `E: Can not write log (Is /dev/pts mounted?)` dan peringatan penghapusan `grub-efi-amd64-signed` adalah langkah pembersihan internal live-build; build tetap `completed successfully`.
- `dpkg-divert: warning ... Essential package` dan `Unrecognised xattr prefix system.posix_acl_*` muncul pada setiap build tanpa dampak yang teramati.

### T-07 — Versi live-build di host tidak sesuai paket (informasi)

- `lb --version` melaporkan 20250814, sedangkan `dpkg` mencatat 3.0~a57. `make install` berhenti di tahap manpage (`po4a`/`dpkg-parsechangelog` tidak ada), tetapi berkas program sudah terpasang sebelum itu.
- **Risiko:** anggota tim lain dengan lingkungan berbeda bisa mendapat hasil build berbeda. Disarankan mendokumentasikan langkah instalasi live-build di README dan menetapkan versi yang dipakai tim.

### T-08 — Password bawaan `live` masih berlaku (rendah, belum diperbaiki)

- **Gejala:** password bawaan `live-config` (`live`) terbukti masih berlaku untuk user `user` pada build 4 (diuji lewat `su - user` di tty1, bukan login tty2).
- **Dampak:** tidak berbahaya selama user tidak punya hak sudo (terbukti pada build 4), tetapi sebaiknya dikunci pada hardening lanjutan.

## 5. Data benchmark (wajib diisi dari pengujian nyata)

Jalankan di dalam VM (`-m 1024 -smp 1`) pada setiap boot, lalu catat:

```bash
systemd-analyze
free -m
```

- **Build 4** (pembanding build 3: rata-rata 8,858 s)

| Boot ke- | Waktu boot total (`systemd-analyze`) | RAM terpakai (`free -m`, kolom used) | RAM tersedia (kolom available) |
|---:|---|---|---|
| 1 | 6,903 s | 256 MiB | 704 MiB |
| 2 | 6,941 s | 258 MiB | 702 MiB |
| 3 | 6,898 s | 258 MiB | 702 MiB |
| Rata-rata | 6,914 s | 257 MiB | ±703 MiB |

Catatan metode: sebutkan apakah `-enable-kvm` dipakai (dipakai pada pengujian ini), jumlah CPU virtual (1), dan jalur boot (UEFI/OVMF). Hasil dari QEMU/KVM tidak bisa dianggap setara dengan perangkat lama fisik.

## 6. Integritas artefak (wajib diisi)

Jalankan di `~/Ujianik/build`:

```bash
ls -lh live-image-amd64.hybrid.iso
sha256sum live-image-amd64.hybrid.iso
```

| Berkas | Ukuran | SHA-256 |
|---|---|---|
| `live-image-amd64.hybrid.iso` (build 3) | 344 MiB | d9695175db65fa24b5dacecf9315a34720aaf21af96fa2b5a4315963045a407d |
| `live-image-amd64.hybrid.iso` (build 4) | 344 MiB (176128 sektor) | e8490d757d0fa0d2ca12db7bb1fac57ab5f8f3b7ef8a10d862e44dfa7df7345e |

ISO tidak di-commit ke repository (sudah di `.gitignore`). Hash dicatat di sini agar hasil dapat diverifikasi.

## 7. Kesimpulan dan status terhadap sasaran proyek

| Sasaran rancangan | Status Tahap 2 |
|---|---|
| ISO dapat di-boot | Terbukti di QEMU (UEFI). Jalur BIOS punya temuan T-02. Perangkat fisik belum diuji |
| Ukuran ISO 600 MB-1 GB | Belum relevan: baseline 344 MiB tanpa browser/kiosk |
| RAM minimal 1 GB | Boot sampai shell dengan 1 GB di QEMU; RAM terpakai ±257 MiB, tersedia ±703 MiB. (baseline tanpa kiosk) |
| Mode kiosk, whitelist, pengawasan, install ke disk, GPG | Belum dikerjakan (Tahap 3–6) |

**Kriteria lanjut ke Tahap 3:** bagian 5 dan 6 sudah dilengkapi; commit laporan ini beserta konfigurasi build.

## 8. Prosedur ulang uji (untuk anggota tim lain)

1. `cd ~/Ujianik/build && sudo lb clean && sudo lb config` (atau jalankan ulang `lb config` dengan opsi di bagian 1).
2. `sudo lb build < /dev/null 2>&1 | tee buildN.log`
3. Pastikan baris terakhir `P: Build completed successfully`.
4. Boot lewat OVMF (perintah di bagian 1), pilih "Live system (amd64)" tanpa mengubah parameter.
5. Verifikasi: prompt `user@debian:~$` muncul, lalu `whoami`, `id`, `systemd-analyze`, `free -m`.
6. Uji login manual: Ctrl+Alt+2 untuk tty2 (user `user`, password `live`).

---

## 9. Pembaruan Build 5 — Perbaikan Boot Mode BIOS (13 November 2026)

Menindaklanjuti temuan **T-02** pada branch `build/perbaiki-bios`, dilakukan perbaikan konfigurasi bootloader Legacy BIOS (`isolinux`) tanpa mengubah basis paket inti.

### A. Akar Masalah & Solusi Teknis
- **Penyebab Tambahan (T-02):** Selain modul menu, berkas konfigurasi `isolinux/*.cfg` hasil tahap `lb binary_syslinux` masih menyisakan token placeholder `@KERNEL@` dan `@INITRD@`, sehingga bootloader BIOS gagal menemukan citra kernel maupun initrd.
- **Perbaikan:** Menambahkan *binary hook* `build/config/hooks/normal/ujianix-0100-fix-isolinux-kernel.hook.binary` yang berjalan pada tahap `lb binary_hooks` untuk mendeteksi nama aktual `vmlinuz*` dan `initrd*` di direktori `live/` serta mengganti seluruh placeholder di `isolinux/*.cfg` sebelum pengemasan ISO oleh `xorriso`.
- **Konfigurasi Build 5:** Menggunakan parameter `--bootappend-live "boot=live components quiet"` (akses `sudo` aktif untuk mempermudah integrasi dan pengujian tahap kiosk oleh pengembang Tahap 3; parameter `noroot` dapat diaktifkan kembali pada tahap hardening akhir).

### B. Hasil Verifikasi & Benchmark Build 5
- **Ukuran ISO:** `345 MB` (`176.640` sektor; `filesystem.squashfs` `279,61 MB`)
- **SHA-256 Checksum (`live-image-amd64.hybrid.iso`):**
  `07cf84e0a57d845ce31280353c3e34bb363ad0f6e5f0d91b6f52f142fb10a206`
- **Uji Boot Legacy BIOS (`qemu-system-x86_64` tanpa OVMF):** **LULUS** — Sistem berhasil *booting* hingga masuk ke sesi TTY `(live)user@localhost:~$`.
- **Uji Boot UEFI (`OVMF.fd`) & 3x Benchmark (`-m 1024 -smp 1 -enable-kvm`):**

| Boot ke- | Waktu Kernel | Waktu Userspace | Total Waktu Boot (`systemd-analyze`) | RAM Terpakai (`used`) | RAM Tersedia (`available`) |
|---:| :---: | :---: | :---: | :---: | :---: |
| 1 | 2,216 s | 6,575 s | 8,792 s | 257 MB | 704 MB |
| 2 | 2,306 s | 12,209 s | 14,515 s | 258 MB | 702 MB |
| 3 | 2,297 s | 6,950 s | 9,248 s | 258 MB | 702 MB |
| **Rata-rata** | **2,273 s** | **8,578 s** | **10,852 s** | **257,67 MB** | **702,67 MB** |

### C. Catatan Handover ke Tahap 3 (Pengembangan Mode Kiosk)
1. Seluruh konfigurasi dasar (`build/config/`) dan *binary hook* perbaikan BIOS (`ujianix-0100-fix-isolinux-kernel.hook.binary`) sudah tersimpan di repositori.
2. Untuk melanjutkan ke mode Kiosk, pengembang Tahap 3 cukup menambahkan daftar paket Xorg/Wayland, *window manager*, dan *browser* kiosk pada `build/config/package-lists/ujianix.list.chroot`, lalu mengaktifkan kembali flag `noroot` pada `--bootappend-live` setelah konfigurasi kiosk selesai.
