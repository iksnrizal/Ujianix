#!/bin/bash

set -euo pipefail

CONFIG_USB="/tmp/ujianix-admin/ujanix/exam-config.json"
CONFIG_RAM="/run/ujanix/exam-config.json"

echo "[INFO] Memulai pembacaan konfigurasi..."

# Memastikan konfigurasi USB tersedia
if [ ! -f "$CONFIG_USB" ]; then
    echo "[ERROR] Konfigurasi USB tidak ditemukan."
    exit 1
fi

# Membuat direktori RAM
mkdir -p /run/ujianix

# Menyalin konfigurasi ke RAM
cp "$CONFIG_USB" "$CONFIG_RAM"

# Mengatur izin file
chmod 600 "$CONFIG_RAM"

echo "[INFO] Konfigurasi berhasil disalin ke RAM."

# Menjalankan validator
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

python3 "$SCRIPT_DIR/validate-config.py" "$CONFIG_RAM"

echo "[OK] Konfigurasi siap digunakan."
