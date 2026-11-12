#!/bin/bash
set -euo pipefail

CONFIG="/run/ujanix/exam-config.json"
FIREWALL_FILE="/run/ujanix/firewall.nft"

echo "=== TEST FIREWALL UJIANIX ==="

if [ ! -f "$CONFIG" ]; then
    echo "[ERROR] Konfigurasi tidak ditemukan."
    exit 1
fi

if [ ! -f "$FIREWALL_FILE" ]; then
    echo "[ERROR] File firewall tidak ditemukan."
    exit 1
fi

echo "[1/5] Memeriksa sintaks nftables..."
sudo nft -c -f "$FIREWALL_FILE"
echo "[OK] Sintaks valid."

echo "[2/5] Memeriksa policy DROP..."
grep -Fq "policy drop;" "$FIREWALL_FILE"
echo "[OK] Policy DROP ditemukan."

echo "[3/5] Memeriksa whitelist IP dan port..."
python3 - "$CONFIG" "$FIREWALL_FILE" <<'PY'
import json
import sys

config_path, firewall_path = sys.argv[1:3]

with open(config_path) as f:
    config = json.load(f)

with open(firewall_path) as f:
    firewall = f.read()

mode = config["mode"]
ips = config["network"]["allowed_ips"]
ports = config["network"]["allowed_ports"]

if mode == "online":
    for ip in ips:
        for port in ports:
            rule = f"ip daddr {ip} tcp dport {port} accept"
            if rule not in firewall:
                print(f"[ERROR] Aturan tidak ditemukan: {rule}")
                sys.exit(1)
            print(f"[OK] {ip}:{port} ditemukan")
elif mode == "offline":
    if "ip daddr" in firewall:
        print("[ERROR] Mode offline masih memiliki aturan whitelist IP.")
        sys.exit(1)
    print("[OK] Mode offline tidak memiliki aturan whitelist IP.")
else:
    print(f"[ERROR] Mode tidak dikenal: {mode}")
    sys.exit(1)

print("[OK] Whitelist sesuai konfigurasi.")
PY

echo "[4/5] Memeriksa aturan loopback..."
grep -Fq 'oifname "lo" accept' "$FIREWALL_FILE"
echo "[OK] Loopback diizinkan."

echo "[5/5] Memeriksa aturan koneksi established..."
grep -Fq 'ct state established,related accept' "$FIREWALL_FILE"
echo "[OK] Established/related ditemukan."

echo
echo "[SUCCESS] Semua pengujian firewall berhasil."
