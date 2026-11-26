#!/bin/bash
set -e

FIREWALL_FILE="/run/ujianix/firewall.nft"

echo "=== TEST FIREWALL UJIANIX ==="

if [ ! -f "$FIREWALL_FILE" ]; then
    echo "[ERROR] File firewall tidak ditemukan."
    exit 1
fi

echo "[1/3] Memeriksa sintaks firewall..."
sudo nft -c -f "$FIREWALL_FILE"
echo "[OK] Sintaks firewall valid."

echo "[2/3] Memeriksa konfigurasi server..."
SERVER_IP=$(sudo python3 -c "import json; print(json.load(open('/run/ujianix/exam-config.json'))['server']['ip'])")

if grep -q "$SERVER_IP" "$FIREWALL_FILE"; then
    echo "[OK] IP server ditemukan dalam aturan firewall."
else
    echo "[ERROR] IP server tidak ditemukan."
    exit 1
fi

echo "[3/3] Memeriksa kebijakan firewall..."
if grep -q "policy drop;" "$FIREWALL_FILE"; then
    echo "[OK] Kebijakan default DROP ditemukan."
else
    echo "[ERROR] Kebijakan default DROP tidak ditemukan."
    exit 1
fi

echo
echo "[SUCCESS] Semua pengujian firewall berhasil."
