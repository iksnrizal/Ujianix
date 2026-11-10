#!/bin/bash

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
