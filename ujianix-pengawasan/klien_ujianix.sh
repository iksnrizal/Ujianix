#!/bin/bash

# Konfigurasi perbaikan display untuk VirtualBox/Sesi Grafis
export DISPLAY=:0
export LIBGL_ALWAYS_SOFTWARE=1

# 1. Pembacaan Konfigurasi yang Aman
DIR_AKTIF="$(dirname "$0")"
CONFIG_FILE="$DIR_AKTIF/konfigurasi_admin.conf"
if [ ! -f "$CONFIG_FILE" ]; then
    echo "Error: Konfigurasi admin tidak ditemukan."
    exit 1
fi
source "$CONFIG_FILE"

# 2. Pengelolaan Sesi & Validasi Identitas
NPM_PESERTA=$(zenity --entry --title="Login Ujianix" --text="Masukkan NPM Anda (Angka):")
if [[ ! "$NPM_PESERTA" =~ ^[0-9]+$ ]]; then
    zenity --error --text="NPM tidak valid. Ujian dibatalkan."
    exit 1
fi
SESI_UJIAN="Ujian_$(date +%Y%m%d)"

# 3. Pemberitahuan Privasi Dinamis
MSG_PRIVASI="Ujian ini diawasi. Data dikirim ke institusi dan TIDAK disimpan di perangkat ini."
[ "$ENABLE_SCREENSHOT" = "true" ] && MSG_PRIVASI="$MSG_PRIVASI\n- Layar Anda direkam berkala."
[ "$ENABLE_WEBCAM" = "true" ] && MSG_PRIVASI="$MSG_PRIVASI\n- Kamera web Anda direkam berkala."
zenity --info --title="Pemberitahuan Privasi Ujianix" --text="$MSG_PRIVASI" --width=450

# 4. Fungsi Pengiriman Jaringan dengan Timeout dan Retry
kirim_data() {
    local file_path=$1
    local npm=$2
    local endpoint=$3
    local max_retry=3
    local attempt=1
    
    while [ $attempt -le $max_retry ]; do
        # Opsi -w mengekstrak HTTP status code, --connect-timeout membatasi waktu tunggu
        response=$(curl -s -w "%{http_code}" -X POST -F "file=@${file_path}" -F "npm=${npm}" -F "sesi=${SESI_UJIAN}" --connect-timeout 10 "${endpoint}")
        http_code="${response: -3}"
        
        if [ "$http_code" = "200" ]; then
            rm -f "$file_path" # Hapus data lokal setelah terkonfirmasi diterima server
            return 0
        fi
        echo "Gagal mengirim data (HTTP $http_code). Coba ulang $attempt/$max_retry..."
        attempt=$((attempt + 1))
        sleep 2
    done
    echo "Peringatan: Gagal mengirim $file_path setelah $max_retry kali percobaan."
}

# 5. Simulasi Pengiriman Jawaban (Struktur JSON yang diperbarui)
curl -s -X POST -H "Content-Type: application/json" \
     -d "{\"npm\": \"$NPM_PESERTA\", \"sesi\": \"$SESI_UJIAN\", \"jawaban\": {\"1\": \"A\", \"2\": \"C\"}}" \
     --connect-timeout 10 "${SERVER_URL}/api/jawaban" > /dev/null

echo "Sesi monitoring dimulai. Tekan Ctrl+C untuk mengakhiri."
# Trap untuk memastikan penghentian monitoring secara tertib
trap 'echo -e "\nUjian Selesai. Sesi monitoring dihentikan."; exit 0' SIGINT SIGTERM

# 6. Loop Pengawasan
while true; do
    TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
    SCREEN_FILE="/tmp/screen_${TIMESTAMP}.png"
    CAM_FILE="/tmp/cam_${TIMESTAMP}.jpg"

    if [ "$ENABLE_SCREENSHOT" = "true" ]; then
        scrot "$SCREEN_FILE" 2>/dev/null
        # Opsi -s memastikan file ada dan ukurannya tidak 0 byte (mencegah file hitam/kosong)
        if [ -s "$SCREEN_FILE" ]; then
            kirim_data "$SCREEN_FILE" "$NPM_PESERTA" "${SERVER_URL}/api/pengawasan"
        else
            echo "Error: scrot gagal menangkap layar dengan benar."
        fi
    fi

    if [ "$ENABLE_WEBCAM" = "true" ]; then
        fswebcam -q -r 640x480 --no-banner "$CAM_FILE" 2>/dev/null
        if [ -s "$CAM_FILE" ]; then
            kirim_data "$CAM_FILE" "$NPM_PESERTA" "${SERVER_URL}/api/pengawasan"
        else
            echo "Error: Webcam tidak terdeteksi atau gagal mengambil gambar."
        fi
    fi

    sleep "$INTERVAL_DETIK"
done#!/bin/bash

# Konfigurasi perbaikan display untuk VirtualBox/Terminal
export DISPLAY=:0
export LIBGL_ALWAYS_SOFTWARE=1

# Membaca konfigurasi dari admin
if [ -f "./konfigurasi_admin.conf" ]; then
    source "./konfigurasi_admin.conf"
else
    echo "Konfigurasi admin tidak ditemukan."
    exit 1
fi

NPM_PESERTA="12345678"

# Menampilkan pemberitahuan privasi secara eksplisit
zenity --info --title="Pemberitahuan Privasi Ujianix" \
       --text="Ujian ini diawasi. Kamera web dan layar Anda akan direkam sesuai konfigurasi institusi dan dikirim ke server. Data tidak akan disimpan di perangkat ini." \
       --width=450

# Simulasi pengiriman jawaban awal
curl -s -X POST -H "Content-Type: application/json" \
     -d "{\"npm\": \"$NPM_PESERTA\", \"jawaban\": {\"1\": \"A\", \"2\": \"C\"}}" \
     "${SERVER_URL}/api/jawaban" > /dev/null

# Loop pengawasan
while true; do
    TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
    SCREEN_FILE="/tmp/screen_${TIMESTAMP}.png"
    CAM_FILE="/tmp/cam_${TIMESTAMP}.jpg"

    if [ "$ENABLE_SCREENSHOT" = "true" ]; then
        scrot "$SCREEN_FILE" 2>/dev/null
        if [ -f "$SCREEN_FILE" ]; then
            curl -s -X POST -F "file=@$SCREEN_FILE" -F "npm=$NPM_PESERTA" "${SERVER_URL}/api/pengawasan" > /dev/null
            rm -f "$SCREEN_FILE"
        fi
    fi

    if [ "$ENABLE_WEBCAM" = "true" ]; then
        fswebcam -q -r 640x480 --no-banner "$CAM_FILE" 2>/dev/null
        if [ -f "$CAM_FILE" ]; then
            curl -s -X POST -F "file=@$CAM_FILE" -F "npm=$NPM_PESERTA" "${SERVER_URL}/api/pengawasan" > /dev/null
            rm -f "$CAM_FILE"
        fi
    fi

    sleep "$INTERVAL_DETIK"
done
