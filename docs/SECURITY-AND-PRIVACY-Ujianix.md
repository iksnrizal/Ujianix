# Keamanan dan Privasi Ujianix

Dokumen ini menjelaskan tujuan pengamanan Ujianix, ruang lingkup fitur terkait keamanan dan pengawasan, serta pertimbangan privasi bagi penyelenggara ujian. Keterangan di bawah membedakan tujuan desain dari jaminan yang telah dibuktikan melalui pengujian.

## 1. Tujuan

Ujianix dirancang untuk membantu menyediakan lingkungan komputer yang lebih terarah selama pelaksanaan ujian, antara lain melalui lingkungan browser kiosk, konfigurasi sistem oleh administrator, dan fitur pengawasan yang dapat diaktifkan sesuai kebutuhan.

Ujianix **tidak menjamin bahwa seluruh bentuk kecurangan, penyalahgunaan, atau serangan dapat dicegah**. Efektivitasnya bergantung pada konfigurasi, perangkat keras, jaringan, platform ujian, serta pengujian dan pengawasan penyelenggara.

## 2. Fitur yang berkaitan dengan keamanan

Fitur dan konfigurasi yang berkaitan dengan keamanan dapat meliputi:

- **Browser kiosk:** membatasi lingkungan penggunaan browser sesuai konfigurasi Ujianix.
- **Pengaturan administrator:** konfigurasi sistem dilakukan melalui mekanisme administrator yang tersedia.
- **Pembatasan akses jaringan:** konfigurasi whitelist atau aturan jaringan dapat digunakan jika diterapkan dan diuji pada build yang digunakan.
- **Boot dan sistem:** konfigurasi boot, layanan, dan akses sistem dapat membantu membentuk lingkungan ujian, tetapi efektivitas pembatasan perlu divalidasi.
- **Sistem pengawasan:** build yang dikonfigurasi untuk pengawasan dapat menggunakan screenshot dan foto webcam serta mengirimkan data ke server pengawas.

Keberadaan skrip atau konfigurasi tidak dengan sendirinya membuktikan bahwa fitur telah aktif, efektif, atau aman. Rujuk hasil pengujian pada build yang digunakan.

## 3. Data pengawasan dan privasi

Jika fitur pengawasan diaktifkan, sistem dapat memproses data seperti:

- Screenshot layar peserta.
- Foto atau gambar yang diambil dari webcam.
- Informasi teknis yang diperlukan untuk mengirim atau mengelola data pengawasan, sesuai implementasi.

Data aktual yang dikumpulkan, formatnya, frekuensi pengambilan, tujuan pemrosesan, dan pihak yang dapat mengaksesnya harus diperiksa berdasarkan konfigurasi dan implementasi server yang digunakan.

## 4. Pemberitahuan kepada peserta

Sebelum pengawasan diaktifkan, penyelenggara harus memberikan pemberitahuan yang mudah dipahami dan memperoleh persetujuan atau dasar pemrosesan yang sesuai dengan aturan yang berlaku.

Pemberitahuan kepada peserta sebaiknya menjelaskan:

- Tujuan pengawasan.
- Data yang diambil (misalnya screenshot atau webcam).
- Kapan dan seberapa sering pengambilan data dilakukan.
- Ke mana data dikirim dan siapa yang dapat mengaksesnya.
- Berapa lama data disimpan.
- Cara peserta mengajukan pertanyaan atau menghubungi penyelenggara.
- Ketentuan yang berlaku dan alternatif atau prosedur yang disediakan penyelenggara jika relevan.

Tampilan persetujuan pada aplikasi, jika tersedia, bukan pengganti tanggung jawab institusi untuk menetapkan kebijakan privasi dan pemrosesan data.

## 5. Server pengawas dan transmisi data

Sistem pengawasan dapat menggunakan server pengawas terpisah dari perangkat peserta. Penyelenggara perlu memeriksa:

- Konfigurasi alamat server dan jaringan.
- Siapa yang memiliki akses ke server.
- Apakah transmisi data menggunakan perlindungan yang memadai (misalnya TLS) dan apakah hal tersebut telah diverifikasi.
- Apakah data disimpan dengan akses terbatas.
- Apakah log server tidak memuat data pribadi yang tidak diperlukan.
- Mekanisme pencadangan, penghapusan, dan penanganan insiden.

Dokumen ini tidak menyatakan bahwa transmisi atau penyimpanan server pengawas telah memenuhi standar keamanan tertentu. Hal tersebut harus diverifikasi pada implementasi aktual.

## 6. Penyimpanan, akses, dan penghapusan data

Penyelenggara ujian bertanggung jawab menetapkan:

- Lokasi penyimpanan data pengawasan.
- Pengguna atau petugas yang diberi akses.
- Periode retensi data yang sesuai dengan tujuan dan ketentuan.
- Prosedur penghapusan data setelah periode retensi.
- Prosedur penanganan permintaan akses atau insiden, sesuai kebijakan institusi dan hukum yang berlaku.

Hindari menyimpan data pengawasan lebih lama dari yang diperlukan. Jangan membagikan screenshot atau rekaman peserta kepada pihak yang tidak berwenang.

## 7. Batasan keamanan

- Mode kiosk bukan jaminan bahwa perangkat tidak dapat diakses atau dimanipulasi.
- Pembatasan jaringan hanya efektif sesuai aturan, konfigurasi, dan kondisi jaringan yang benar-benar diterapkan.
- Sistem pengawasan tidak dapat memastikan semua pelanggaran terdeteksi.
- Keamanan perangkat dapat dipengaruhi firmware, perangkat keras, akses fisik, konfigurasi, dan komponen pihak ketiga.
- Keamanan server pengawas dan platform ujian berada dalam ruang lingkup pengelolaan yang perlu ditinjau terpisah.
- Fitur yang belum diuji tidak boleh dianggap sebagai perlindungan yang efektif.

## 8. Praktik yang disarankan bagi penyelenggara

1. Uji ISO yang akan digunakan pada perangkat dan jaringan yang relevan sebelum hari ujian.
2. Gunakan konfigurasi administrator yang hanya dapat diakses petugas berwenang.
3. Verifikasi aturan jaringan dan tujuan akses ujian.
4. Pastikan peserta menerima pemberitahuan pengawasan sebelum fitur tersebut digunakan.
5. Batasi akses server dan data pengawasan.
6. Tetapkan periode retensi dan prosedur penghapusan.
7. Dokumentasikan hasil pengujian, konfigurasi, serta insiden.
8. Sediakan kontak untuk pertanyaan atau masalah peserta.

## 9. Pelaporan masalah keamanan

Jika menemukan masalah keamanan pada Ujianix, hindari memublikasikan detail yang dapat digunakan untuk menyerang perangkat atau peserta sebelum pengelola proyek memiliki kesempatan untuk menilai dan menangani masalah tersebut.

Saat melaporkan masalah, sertakan informasi yang tidak sensitif, seperti versi atau commit Ujianix, deskripsi masalah, langkah reproduksi pada lingkungan uji, dan dampak yang diamati. Jangan sertakan data peserta, kredensial, atau informasi pribadi dalam laporan publik.

---

Dokumen ini merupakan panduan umum untuk proyek dan penyelenggara. Kebijakan pengawasan, pengelolaan data, dan kepatuhan harus disesuaikan dengan implementasi aktual serta aturan yang berlaku.
