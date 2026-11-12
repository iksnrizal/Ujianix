
#!/bin/bash
set -euo pipefail

CONFIG_USB="/home/nazuuraliaa/ujanix-admin/ujanix/exam-config.json"
CONFIG_RAM="/run/ujanix/exam-config.json"

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "[INFO] Memulai pembacaan konfigurasi..."

# Memastikan konfigurasi USB tersedia
if [ ! -f "$CONFIG_USB" ]; then
    echo "[ERROR] Konfigurasi USB tidak ditemukan."
    exit 1
fi

# Memastikan konfigurasi dapat dibaca
if [ ! -r "$CONFIG_USB" ]; then
    echo "[ERROR] Konfigurasi USB tidak dapat dibaca."
    exit 1
fi

# Validasi konfigurasi sumber sebelum disalin ke RAM
python3 "$SCRIPT_DIR/validate-config.py" "$CONFIG_USB"

# Membuat direktori RAM
mkdir -p /run/ujanix

# Menyalin konfigurasi valid ke RAM dengan izin 600
install -m 600 "$CONFIG_USB" "$CONFIG_RAM"

echo "[INFO] Konfigurasi berhasil disalin ke RAM."
echo "[OK] Konfigurasi siap digunakan."
